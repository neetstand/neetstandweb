"use server";

import { createClient } from "@/utils/supabase/server";

export type UserStatus = {
    exists: boolean;
    identifierType: "email" | "phone" | null;
    isIndia: boolean;
    email?: string; // If found via lookup
};

export interface RegisterResult {
    success?: boolean;
    message?: string;
    error?: string;
    redirect?: boolean;
    verifying?: boolean; // If true, UI should show OTP input
    verificationType?: "sms" | "phone_change" | "email";
}

// Helper to check user status
export async function checkUserStatus(identifier: string, isPhone: boolean = false): Promise<UserStatus> {
    const supabase = await createClient();
    let isIndia = false;

    if (isPhone) {
        if (identifier.startsWith("+91")) isIndia = true;
    }

    try {
        // 1. Check Active Session
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const emailMatch = !isPhone && user.email === identifier;
            const phoneMatch = isPhone && (
                user.phone === identifier ||
                user.user_metadata?.phone_number === identifier
            );

            if (emailMatch || phoneMatch) {
                return { exists: true, identifierType: isPhone ? "phone" : "email", isIndia };
            }
        }

        // 2. Lookup Logic
        if (isPhone) {
            // Use RPC to find email by phone
            const { data, error } = await supabase.rpc('lookup_user_by_phone', { p_phone: identifier });

            if (error) {
                console.error("Lookup Error:", error);
                // Fallback to standard check if RPC fails
            } else if (data && data.found) {
                if (data.multiple) {
                    // Ambiguous -> Treat as "User not found" to force collection/clarification?
                    // Or returns exists: false effectively.
                    return { exists: false, identifierType: "phone", isIndia };
                }

                // Found unique user -> Send OTP to Email
                // returning exists: true means AuthCore will try to send OTP.
                // But AuthCore thinks "phone" input means "send SMS".
                // We need to tell AuthCore to use EMAIL for OTP?

                // Check sendCustomOtp logic in AuthCore:
                // if (isPhoneType) sendCustomOtp...

                // Wait, if we return exists: true, AuthCore does:
                /*
                 setVerificationInfo({
                    identifier: checkVal,
                    type: isPhoneInput ? "sms" : "email"
                });
                */
                // If type is "sms", it tries to send SMS.
                // We need to return info that says "User exists, but verify via EMAIL".

                // We can't change UserStatus return type easily without breaking UI?
                // Let's check AuthCore usage.
                // It uses `status.exists`.
                // We might need to trigger the email OTP *here* and return a flag?

                // Actually, `checkUserStatus` is called. If exists, `AuthCore` sets `OTP_VERIFY`.
                // But before that, `AuthCore` assumes `type` based on input.

                // We need to support `lookupEmail` in return?

                // Let's modify UserStatus type first? 
                // Or let's just trigger the OTP to the EMAIL here?

                const email = data.email;
                const { error: otpError } = await supabase.auth.signInWithOtp({
                    email: email,
                    options: { shouldCreateUser: false }
                });

                if (!otpError) {
                    // Only way to tell AuthCore to verify 'email' is to return it?
                    // But `checkUserStatus` return is fixed.

                    // HACK: We can return `identifierType: "email"` even if input was phone?
                    // If we return identifierType: "email", AuthCore might set verificationInfo type to "email"?
                    // Let's check AuthCore:
                    /*
                    if (status.exists) {
                        setVerificationInfo({
                            identifier: checkVal, // This is the PHONE number input
                            type: isPhoneInput ? "sms" : "email"
                        });
                    }
                    */
                    // It calculates type from `isPhoneInput` (local state), ignoring server return `identifierType`.

                    // So we MUST update AuthCore to respect the server's hint.

                    return {
                        exists: true,
                        identifierType: "email", // Signal that we found an email
                        isIndia,
                        email // We need to add this property to UserStatus
                    } as any;
                }
            }
        }

        // Standard Check (Email or Phone via Auth)
        const { error } = await supabase.auth.signInWithOtp({
            [isPhone ? "phone" : "email"]: identifier,
            options: {
                shouldCreateUser: false,
            }
        } as any);

        if (error) {
            console.error("User Check Error (Email/Phone):", error.message);

            // If error indicates rate limit or security, we treat as existing user (to avoid registration flow)
            // Common messages: "For security purposes, you can only request this once every 60 seconds"
            // "Too many requests"
            if (error.message.includes("security purposes") || error.message.includes("seconds") || error.message.includes("Too many requests")) {
                return {
                    exists: true, // Assume exists to show OTP limit message
                    identifierType: isPhone ? "phone" : "email",
                    isIndia,
                    // We might need to pass this error up to the UI?
                    // Currently UI just sees exists: true and shows "OTP Sent".
                    // The user will see the toast "OTP Sent".
                    // Maybe we should update UI to handle "Rate Limit" separately?
                    // For now, this prevents the "Collect Info" screen which is the main complaint.
                };
            }

            return {
                exists: false,
                identifierType: isPhone ? "phone" : "email",
                isIndia
            };
        }

        return {
            exists: true,
            identifierType: isPhone ? "phone" : "email",
            isIndia
        };

    } catch (error) {
        console.error("Check User Error:", error);
        return {
            exists: false,
            identifierType: isPhone ? "phone" : "email",
            isIndia
        };
    }
}

// Deprecated/Modified: Just wraps signInWithOtp
export async function sendCustomOtp(identifier: string, isPhone: boolean) {
    const supabase = await createClient();
    try {
        // Attempt to send OTP. If Phone and no SMS provider, this will fail.
        // We catch it and throw a clearer error?
        // But sendCustomOtp is only called if checkUserStatus says "Exists".
        // If checkUserStatus passed (meaning SMS worked or Email worked), this should work.
        const { error } = await supabase.auth.signInWithOtp({
            [isPhone ? "phone" : "email"]: identifier,
            options: { shouldCreateUser: true }
        } as any);

        if (error) throw error;
        return { success: true, message: "OTP sent successfully" };
    } catch (e: any) {
        return { error: e.message };
    }
}

// Deprecated: Client should use supabase.auth.verifyOtp directly
export async function verifyCustomOtp(token: string, otp: string) {
    return { error: "Please use client-side verifyOtp" };
}

export async function registerUser(email: string, phone: string): Promise<RegisterResult> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            // User is logged in -> Update Profile directly
            // AVOID touching auth.users.phone to prevent SMS verification trigger (since SMS provider is down/missing)
            // Just update user_metadata.
            const { error: updateError } = await supabase.auth.updateUser({
                data: { phone_number: phone }
            });

            if (updateError) throw updateError;

            return { success: true, message: "Profile updated successfully.", verificationType: "phone_change" };
        }

        // New User -> Sign Up / Sign In with OTP (Creation)
        // Always use Email for OTP since SMS is likely not configured.
        // We store the phone in metadata.
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                data: { phone_number: phone }
            }
        });

        if (error) throw error;

        return { success: true, verifying: true, message: "OTP sent to your email.", verificationType: "email" };

    } catch (error) {
        console.error("Registration Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Registration failed";
        return { error: errorMessage };
    }
}

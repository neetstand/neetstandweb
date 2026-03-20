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

        // 2. Lookup Logic (Restored)
        if (isPhone) {
            // Use RPC to find email by phone
            const { data, error } = await supabase.rpc('lookup_user_by_phone', { p_phone: identifier });

            if (error) {
                console.error("Lookup Error:", error);
            } else if (data && data.found) {
                if (data.multiple) {
                    // Ambiguous -> User must enter email manually
                    return { exists: false, identifierType: "phone", isIndia };
                }

                // Found unique user -> Send OTP to Email
                const email = data.email;
                const { error: otpError } = await supabase.auth.signInWithOtp({
                    email: email,
                    options: { shouldCreateUser: false }
                });

                if (!otpError) {
                    return {
                        exists: true,
                        identifierType: "email", // Signal valid email found
                        isIndia,
                        email // Return matched email
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

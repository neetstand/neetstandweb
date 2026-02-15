"use server";

import { createClient } from "@/utils/supabase/server";

export type UserStatus = {
    exists: boolean;
    identifierType: "email" | "phone" | null;
    isIndia: boolean;
};

export interface RegisterResult {
    success?: boolean;
    message?: string;
    error?: string;
    redirect?: boolean;
    verifying?: boolean; // If true, UI should show OTP input
    verificationType?: "sms" | "phone_change" | "email";
}

export async function checkUserStatus(identifier: string, isPhone: boolean = false): Promise<UserStatus> {
    const supabase = await createClient();
    let isIndia = false;

    if (isPhone) {
        if (identifier.startsWith("+91")) isIndia = true;
    }

    try {
        // Check if there is an active session (e.g. OAuth user)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Check if the identifier matches the current user
            const emailMatch = !isPhone && user.email === identifier;
            const phoneMatch = isPhone && (user.phone === identifier || user.user_metadata?.phone_number === identifier);

            if (emailMatch || phoneMatch) {
                return { exists: true, identifierType: isPhone ? "phone" : "email", isIndia };
            }
        }

        // We use signInWithOtp with shouldCreateUser: false to check existence
        const { error } = await supabase.auth.signInWithOtp({
            [isPhone ? "phone" : "email"]: identifier,
            options: {
                shouldCreateUser: false,
            }
        } as any);

        if (error) {
            // If error is "User not found" or "SMS provider not set", return does not exist
            // This forces the "COLLECT_INFO" step, allowing user to provide email if they started with phone.
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

"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { OtpService } from "@/services/otp";

export type UserStatus = {
    exists: boolean;
    identifierType: "email" | "phone" | null;
    isIndia: boolean;
};

export async function checkUserStatus(identifier: string, isPhone: boolean = false): Promise<UserStatus> {
    let isIndia = false;

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("Missing SUPABASE_SERVICE_ROLE_KEY");
        return { exists: false, identifierType: isPhone ? "phone" : "email", isIndia: false };
    }

    if (isPhone) {
        if (identifier.startsWith("+91")) isIndia = true;
    }

    try {
        const supabase = createAdminClient();
        // NOTE: listUsers is efficient enough for small userbases, but check specifically by filter if possible
        // But listUsers doesn't support filtering by phone directly in the method easily without iterating
        // or using search. For production with many users, getUserById is strictly by ID.
        // We can use listUsers({ query: identifier }) if supported, but typically we iterate or rely on catching sign-up errors.
        // However, for "checkUserStatus" to be accurate, we will iterate the list (assuming <1000 users for now).
        // Optimization: Use `getUserByEmail` if email. Phone is harder.

        let exists = false;

        if (!isPhone) {
            const { data, error } = await supabase.auth.admin.listUsers();
            if (!error && data.users) {
                exists = data.users.some(u => u.email === identifier);
            }
        } else {
            const { data, error } = await supabase.auth.admin.listUsers();
            if (!error && data.users) {
                exists = data.users.some(u => u.phone === identifier);
            }
        }

        return {
            exists,
            identifierType: isPhone ? "phone" : "email",
            isIndia
        };

    } catch (error) {
        console.error("Check User failed:", error);
        return {
            exists: false,
            identifierType: isPhone ? "phone" : "email",
            isIndia: false
        };
    }
}

// -- Custom OTP Actions --

export async function sendCustomOtp(identifier: string, isPhone: boolean) {
    return await OtpService.send(identifier, isPhone);
}

export async function verifyCustomOtp(token: string, otp: string) {
    return await OtpService.verify(token, otp);
}

export async function registerUser(email: string, phone: string) {

    try {
        const supabase = createAdminClient();

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            phone,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: { phone_number: phone }
        });

        if (error) throw error;

        // After creation, send OTP
        return await sendCustomOtp(email, false); // Send to email
    } catch (error) {
        console.error("Registration Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Registration failed";
        return { error: errorMessage };
    }
}



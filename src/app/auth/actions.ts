"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/");
}

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, message: "Check your email to confirm your account." };
}

export async function signInWithOtp(formData: FormData) {
    const phone = formData.get("phone") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        phone,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function verifyOtp(formData: FormData) {
    const phone = formData.get("phone") as string;
    const token = formData.get("otp") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

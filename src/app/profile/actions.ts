"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileState = {
    success?: boolean;
    error?: string;
    message?: string;
};

export async function updatePersonalInfo(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { error: "Unauthorized" };
        }

        const fullName = formData.get("fullName") as string;

        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: fullName,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

        if (error) throw error;

        // Also update auth.users metadata for consistency
        await supabase.auth.updateUser({
            data: { full_name: fullName }
        });

        revalidatePath("/profile");
        return { success: true, message: "Personal info updated successfully" };

    } catch (error) {
        console.error("Personal Info Update Error:", error);
        return { error: "Failed to update personal info" };
    }
}

export async function updatePreferences(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const supabase = await createClient();

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { error: "Unauthorized" };
        }

        // Notification preferences
        const newsletter = formData.get("newsletter") === "on";
        const courseLaunch = formData.get("courseLaunch") === "on";
        const cityEvents = formData.get("cityEvents") === "on";
        const email = formData.get("email") === "on";
        const sms = formData.get("sms") === "on";
        const phone = formData.get("phone") === "on";

        const updates = {
            newsletter,
            course_launch: courseLaunch,
            city_events: cityEvents,
            email,
            sms,
            phone,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);

        if (error) throw error;

        revalidatePath("/profile");
        return { success: true, message: "Preferences updated successfully" };

    } catch (error) {
        console.error("Preferences Update Error:", error);
        return { error: "Failed to update preferences" };
    }
}

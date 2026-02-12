"use server";
import { revalidateTag } from "next/cache";

export async function refreshSettings() {
    try {
        revalidateTag("settings");
        return { errors: null };
    } catch (error) {
        console.error("Failed to refresh settings:", error);
        return { errors: "Failed to refresh settings. Please try again later." };
    }
}
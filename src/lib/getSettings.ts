

import { createStaticClient } from "@/utils/supabase/server";
import { cacheLife, cacheTag } from "next/cache";
import { AppConfig, AppConfigType } from "./constants";

export type Settings = Record<string, string>;

export async function getSettings(): Promise<Settings> {
    "use cache";
    cacheLife('adminControlledYear');
    cacheTag("settings");

    const supabase = await createStaticClient();
    try {
        const { data, error } = await supabase.from("settings").select("*");

        if (error) {
            console.error("Error fetching settings:", JSON.stringify(error, null, 2));
            return { ...AppConfig, maintenance_mode: "true" };
        }

        const dbSettings: Record<string, string> = {};
        for (const row of data) {
            dbSettings[row.variable] = row.value;
        }

        const settings: AppConfigType & Record<string, string> = {
            maintenance_mode: "true", // Default to true for safety
            ...AppConfig,
            ...dbSettings
        }



        return settings;

    } catch (err) {
        console.error("Exception fetching settings:", err);
        return { ...AppConfig, maintenance_mode: "true" };
    }
}


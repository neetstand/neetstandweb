
import { createClient } from "@supabase/supabase-js";
import { revalidateTag, unstable_cache } from "next/cache";

export type Settings = Record<string, string>;

async function fetchSettingsFromDB(): Promise<Settings> {
    // Use Service Role Key for server-side trusted fetching
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials in getSettings (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
        return {};
    }

    // Direct Supabase client to bypass RLS and Auth context issues on server
    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false }
    });

    try {
        const { data, error } = await supabase.from("settings").select("*");

        if (error) {
            console.error("Error fetching settings:", JSON.stringify(error, null, 2));
            return {};
        }

        const settings: Settings = {};
        if (data) {
            // console.log("Settings fetching: Found " + data.length + " rows");
            for (const row of data) {
                // Using 'key' based on user's previous snippet, falling back to 'variable' if schema differs
                const key = row.key || row.variable;
                // console.log("Settings fetching: Row key=" + key + ", value=" + row.value);
                if (key && row.value !== null) {
                    settings[key] = row.value;
                }
            }
        } else {
            // console.log("Settings fetching: No data found");
        }
        return settings;
    } catch (err) {
        console.error("Exception fetching settings:", err);
        return {};
    }
}

export const getSettings = unstable_cache(
    async () => {
        return await fetchSettingsFromDB();
    },
    ['settings-key'],
    { tags: ['settings'] }
);

/**
 * Updates the cache tag for settings.
 * This should be called by the refresh API route.
 */
export async function updateSettingsCache() {
    revalidateTag("settings");
}

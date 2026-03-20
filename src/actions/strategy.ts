"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserStrategyData() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase.rpc("get_user_strategy_data", { p_user_id: user.id });

    if (error) {
        console.error("Error fetching user strategy data:", error);
        return null;
    }

    return data as { subject: string; chapter_name: string; progress: number }[];
}

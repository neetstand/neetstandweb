"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAvailableSprintPlans() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("sprint_plans")
        .select("id, name, description")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching sprint plans:", error);
        return [];
    }

    return data || [];
}

export async function getActiveSprintPlan(planId: string) {
    const supabase = await createClient();
    const { data: plan, error: planError } = await supabase
        .from("sprint_plans")
        .select("*")
        .eq("id", planId)
        .single();

    if (planError) {
        console.error("Error fetching active sprint plan:", planError);
        return null;
    }

    const { data: days, error: daysError } = await supabase
        .from("sprint_plan_days")
        .select(`
            *,
            physicsChapter:physics_chapter_code (chapter_name, toughness, learning_speed, number_of_topics),
            chemistryChapter:chemistry_chapter_code (chapter_name, toughness, learning_speed, number_of_topics),
            biologyChapter:biology_chapter_code (chapter_name, toughness, learning_speed, number_of_topics)
        `)
        .eq("plan_id", planId)
        .order("day_number", { ascending: true });

    if (daysError) {
        console.error("Error fetching sprint plan days:", daysError);
    }

    const { data: bonuses, error: bonusesError } = await supabase
        .from("sprint_plan_bonuses")
        .select(`
            *,
            chapter:chapter_code (chapter_name, toughness, learning_speed, number_of_topics)
        `)
        .eq("plan_id", planId)
        .order("start_order", { ascending: true });

    if (bonusesError) {
        console.error("Error fetching sprint plan bonuses:", bonusesError);
    }

    return {
        ...plan,
        days: days || [],
        bonuses: bonuses || [],
    };
}

export async function updateActiveSprintPlan(planId: string | null) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from("profiles")
        .update({ active_sprint_plan_id: planId })
        .eq("id", user.id);

    if (error) {
        console.error("Error updating active sprint plan:", error);
        throw new Error("Failed to update active plan");
    }

    return { success: true };
}

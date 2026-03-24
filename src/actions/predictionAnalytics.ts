"use server";

import { createClient } from "@/utils/supabase/server";

export interface PredictionStageData {
    stage: string;
    predicted_lower: number;
    predicted_upper: number;
    confidence_score: number;
    days_covered: number;
}

export async function fetchUserScorePredictions(): Promise<PredictionStageData[] | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    try {
        const { data: predictions } = await supabase
            .from("score_predictions")
            .select("stage, predicted_lower, predicted_upper, confidence_score, days_covered")
            .eq("user_id", user.id)
            .order("days_covered", { ascending: true }); // Make sure they are ordered properly

        return predictions || [];
    } catch (e) {
        console.error("Error fetching score predictions:", e);
        return null;
    }
}

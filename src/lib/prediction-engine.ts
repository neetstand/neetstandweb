import { SupabaseClient } from "@supabase/supabase-js";

export type PredictionStage = "S1" | "S2" | "S3" | "S4";

export interface PredictionResult {
    stage: PredictionStage;
    userId: string;
    daysCovered: number;
    predictedLower: number;
    predictedUpper: number;
    confidenceScore: number;
}

export async function calculatePredictionForUser(
    supabase: SupabaseClient,
    userId: string,
    stage: PredictionStage,
    daysCovered: number
): Promise<PredictionResult | null> {
    // 1. Fetch Diagnostic Score
    // First find the user's attempt
    const { data: attempts } = await supabase
        .from('diagnostic_attempts')
        .select(`
            id,
            diagnostic_results (
                correct_count,
                total_questions
            )
        `)
        .eq('user_id', userId)
        .limit(1);

    let diagnosticScore = 0;
    let hasDiagnostic = false;

    if (attempts && attempts.length > 0 && attempts[0].diagnostic_results && attempts[0].diagnostic_results.length > 0) {
        const result = attempts[0].diagnostic_results[0];
        if (result.total_questions > 0) {
            diagnosticScore = (result.correct_count / result.total_questions) * 720;
            hasDiagnostic = true;
        }
    }

    // 2. Performance Score (Accuracy based, weighted by chapters)
    // Fetch user answers and join with chapters to get weightage
    const { data: answers } = await supabase
        .from('user_questions')
        .select(`
            is_correct,
            sub_chapter_id,
            sub_chapters:sub_chapter_id (
                chapters:chapter_id (
                    weightage_percent
                )
            )
        `)
        .eq('user_id', userId);

    const questionsAttempted = answers?.length || 0;
    // Condition to start
    if (!hasDiagnostic && questionsAttempted < 20) {
        // Minimum data requirement not met and no diagnostic
        return null;
    }

    let performanceScore = 0;
    if (questionsAttempted > 0) {
        let totalWeightCorrect = 0;
        let totalWeightAttempted = 0;
        let basicCorrect = 0;

        for (const ans of (answers || [])) {
            let weight = 1; // Default fallback weight
            try {
                // Safely extract chapter weightage (it might be a string in decimal format)
                const chapMatch = (ans.sub_chapters as any)?.chapters;
                if (chapMatch && chapMatch.weightage_percent != null) {
                    weight = parseFloat(chapMatch.weightage_percent);
                }
            } catch (e) {}

            totalWeightAttempted += weight;
            if (ans.is_correct) {
                totalWeightCorrect += weight;
                basicCorrect++;
            }
        }

        const accuracy = totalWeightAttempted > 0 ? (totalWeightCorrect / totalWeightAttempted) : (basicCorrect / questionsAttempted);
        performanceScore = accuracy * 720;
    }

    // 3. Effort Score
    // Using simple proxy: attempted questions / 200 (capped at 100%) as an effort index
    // Also taking an approximation of syllabus if a "completed_days" equivalent is in sprint_plans, but this is sufficient.
    const effortIndex = Math.min(1, questionsAttempted / 100); 
    const effortScore = effortIndex * 720;

    // 4. Exam Temperament (Quiz approximation)
    let quizScore = performanceScore * 0.95; // Since we don't have a specific table for "quizzes" yet, we approximate it slightly lower than raw performance 

    // Compute Final Weighted Score
    let predicted_score = 0;

    if (hasDiagnostic) {
        predicted_score = (diagnosticScore * 0.35) + (performanceScore * 0.35) + (effortScore * 0.20) + (quizScore * 0.10);
    } else {
        predicted_score = (performanceScore * 0.50) + (effortScore * 0.30) + (quizScore * 0.20);
    }

    // Edge case if prediction logic gives NaN somehow
    if (isNaN(predicted_score)) predicted_score = 250; 

    // Calculate Confidence & Range
    const confidence = Math.min(1, questionsAttempted / 200);
    const rangeMargin = (1 - confidence) * 120;

    let predictedLower = Math.floor(predicted_score - rangeMargin);
    let predictedUpper = Math.ceil(predicted_score + rangeMargin);

    // Clamp values
    predictedLower = Math.max(0, Math.min(720, predictedLower));
    predictedUpper = Math.max(0, Math.min(720, predictedUpper));
    if (predictedLower > predictedUpper) {
        predictedLower = predictedUpper;
    }

    return {
        stage,
        userId,
        daysCovered,
        predictedLower,
        predictedUpper,
        confidenceScore: confidence
    };
}

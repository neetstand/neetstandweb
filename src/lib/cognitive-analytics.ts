import { SupabaseClient } from "@supabase/supabase-js";

export interface CognitiveScores {
    memorization: number;
    understanding: number;
    application: number;
    analysis: number;
    totalAttempted: number;
}

export interface ChapterCognitiveProfile {
    isLocked: boolean;
    scores: CognitiveScores | null;
}

/**
 * Computes the raw cognitive scores from an array of joined user_questions records.
 */
function calculateScores(userQuestions: any[]): CognitiveScores {
    let memTotal = 0, memCorrect = 0;
    let undTotal = 0, undCorrect = 0;
    let appTotal = 0, appCorrect = 0;
    let anaTotal = 0, anaCorrect = 0;
    let totalAttempted = 0;

    for (const uq of userQuestions) {
        if (!uq.question) continue;
        
        // We only consider questions that were actually attempted (is_correct is true or false).
        // Null means not attempted/skipped, so we skip them.
        if (uq.is_correct === null || uq.is_correct === undefined) continue;

        totalAttempted++;

        // Default to 0 if the question doesn't have the weight defined
        const qMem = uq.question.memorization_pct || 0;
        const qUnd = uq.question.understanding_pct || 0;
        const qApp = uq.question.application_pct || 0;
        const qAna = uq.question.analytical_pct || 0; // Note: analytical_pct in the DB schema

        memTotal += qMem;
        undTotal += qUnd;
        appTotal += qApp;
        anaTotal += qAna;

        if (uq.is_correct === true) {
            memCorrect += qMem;
            undCorrect += qUnd;
            appCorrect += qApp;
            anaCorrect += qAna;
        }
    }

    return {
        memorization: memTotal > 0 ? Math.round((memCorrect / memTotal) * 100) : 0,
        understanding: undTotal > 0 ? Math.round((undCorrect / undTotal) * 100) : 0,
        application: appTotal > 0 ? Math.round((appCorrect / appTotal) * 100) : 0,
        analysis: anaTotal > 0 ? Math.round((anaCorrect / anaTotal) * 100) : 0,
        totalAttempted
    };
}

/**
 * Returns the overall global cognitive profile for all attempted questions across all chapters.
 */
export async function getGlobalCognitiveProfile(
    supabase: SupabaseClient,
    userId: string
): Promise<CognitiveScores> {
    const { data: userQuestions, error } = await supabase
        .from('user_questions')
        .select(`
            is_correct,
            question:questions (
                memorization_pct,
                understanding_pct,
                application_pct,
                analytical_pct
            )
        `)
        .eq('user_id', userId)
        .not('is_correct', 'is', null);

    if (error || !userQuestions) {
        return { memorization: 0, understanding: 0, application: 0, analysis: 0, totalAttempted: 0 };
    }

    return calculateScores(userQuestions);
}

/**
 * Returns the cognitive profile strictly for a single chapter.
 * ENFORCES COMPLETION: If the user has not completed all sub_chapters in this chapter,
 * it returns isLocked: true and suppresses the data to prevent partial radar charts.
 */
export async function getChapterCognitiveProfile(
    supabase: SupabaseClient,
    userId: string,
    chapterCode: string
): Promise<ChapterCognitiveProfile> {
    // 1. Fetch all sub-chapters for this chapter
    const { data: subChapters, error: scError } = await supabase
        .from('sub_chapters')
        .select('id, sub_chapter_code')
        .eq('chapter_code', chapterCode);

    if (scError || !subChapters || subChapters.length === 0) {
        return { isLocked: true, scores: null };
    }

    const subChapterIds = subChapters.map(sc => sc.id);
    const subChapterCodes = subChapters.map(sc => sc.sub_chapter_code);

    // 2. Enforce the UX Rule: Check if ALL sub_chapters are completed by the user
    // (A chapter is considered finished if all its subtopics have an is_completed=true record in user_chapter_progress)
    const { data: progressInfo, error: progError } = await supabase
        .from('user_chapter_progress')
        .select('sub_chapter_code')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .in('sub_chapter_code', subChapterCodes);

    if (progError) {
        return { isLocked: true, scores: null };
    }

    // Determine completion (if they completed as many subtopics as exist)
    const completedCount = new Set(progressInfo?.map(p => p.sub_chapter_code)).size;
    const isFullyCompleted = completedCount >= subChapters.length;

    if (!isFullyCompleted) {
        return { isLocked: true, scores: null };
    }

    // 3. The chapter is unlocked. Compute the cognitive traits purely from the questions inside these subchapters.
    const { data: userQuestions, error: uqError } = await supabase
        .from('user_questions')
        .select(`
            is_correct,
            question:questions (
                memorization_pct,
                understanding_pct,
                application_pct,
                analytical_pct
            )
        `)
        .eq('user_id', userId)
        .in('sub_chapter_id', subChapterIds)
        .not('is_correct', 'is', null);

    if (uqError || !userQuestions) {
        return { isLocked: true, scores: { memorization: 0, understanding: 0, application: 0, analysis: 0, totalAttempted: 0 } };
    }

    const scores = calculateScores(userQuestions);

    // Safety fallback: if no questions were attempted even though marked complete, still treat it as 0
    return {
        isLocked: false,
        scores
    };
}

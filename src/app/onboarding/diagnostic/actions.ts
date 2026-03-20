"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Interaction Event Types (shared with client) ───────────────────────

export type InteractionEvent = {
    type: "option_select" | "option_change" | "question_navigate";
    timestamp: number;       // Date.now() epoch ms
    questionIndex: number;
    option?: string;         // For option_select / option_change
    previousOption?: string; // For option_change only
};

// ─── Auth helper ────────────────────────────────────────────────────────

async function signOutAndRedirect(): Promise<never> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

// ─── Diagnostic State ───────────────────────────────────────────────────

export async function getDiagnosticState() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return await signOutAndRedirect();

    const { count: attemptCount } = await supabase
        .from("diagnostic_attempts")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    // Check profile for explicit restart status
    const { data: profile } = await supabase.from('profiles').select('onboarding_status').eq('id', user.id).single();
    if (profile?.onboarding_status === 'DIAGNOSTIC_NOT_STARTED') {
        return { status: "NOT_STARTED", attemptId: null, attemptCount: attemptCount || 0 };
    }

    const { data: attempt } = await supabase
        .from("diagnostic_attempts")
        .select("id, created_at, diagnostic_results(id)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (!attempt) {
        return { status: "NOT_STARTED", attemptId: null, attemptCount: attemptCount || 0 };
    }

    const hasResults = Array.isArray(attempt.diagnostic_results) 
        ? attempt.diagnostic_results.length > 0 
        : !!attempt.diagnostic_results;

    if (hasResults) {
        return { status: "COMPLETED", attemptId: attempt.id, attemptCount: attemptCount || 0 };
    }

    return { status: "IN_PROGRESS", attemptId: attempt.id, createdAt: attempt.created_at, attemptCount: attemptCount || 0 };
}

// ─── Start Test ─────────────────────────────────────────────────────────

export async function startDiagnosticTest() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return await signOutAndRedirect();

    const state = await getDiagnosticState();
    
    // Check if user already has 2 attempts
    const { count: attemptCount } = await supabase
        .from("diagnostic_attempts")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    if (attemptCount && attemptCount >= 1 && state.status !== "IN_PROGRESS") {
        return { success: false, redirect: "/onboarding/diagnostic/complete" };
    }
    
    if (state.status === "IN_PROGRESS") {
        return { success: true, attemptId: state.attemptId };
    }

    // 1. Call Secure Postgres Stored Procedure to generate test directly on the DB server
    const { data: rpcResult, error: rpcError } = await supabase.rpc('generate_diagnostic_test', {
        p_user_id: user.id
    });

    if (rpcError) {
        console.error("Failed to execute generation RPC:", rpcError);
        throw new Error("Failed to generate test questions securely.");
    }
    
    const attemptId = rpcResult.attemptId;

    // Also update boarding status
    await supabase.from('profiles').update({ onboarding_status: 'DIAGNOSTIC_STARTED' }).eq('id', user.id);

    revalidatePath("/onboarding", "layout");
    return { success: true, attemptId };
}

// ─── Submit Test ────────────────────────────────────────────────────────

export async function submitDiagnosticTest(
    attemptId: string,
    userAnswers: Record<string, string>,
    interactions?: InteractionEvent[]
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return await signOutAndRedirect();

    // Fetch questions to evaluate
    const { data: questions, error } = await supabase
        .from("diagnostic_questions")
        .select("*")
        .eq("attempt_id", attemptId);

    if (error || !questions) throw new Error("Failed to submit test");

    let correctCount = 0;
    let attemptedCount = 0;
    const topicPerformance: Record<string, { total: number; correct: number; attempted: number }> = {};
    const weakAreas: string[] = [];

    for (const q of questions) {
        const subject = q.subject || "General";
        const selectedOption = userAnswers[q.id];

        const isAttempted = selectedOption !== undefined && selectedOption !== null && selectedOption !== "";
        if (isAttempted) attemptedCount++;

        const isCorrect = isAttempted && selectedOption === q.correct_option;
        if (isCorrect) correctCount++;

        if (!topicPerformance[subject]) topicPerformance[subject] = { total: 0, correct: 0, attempted: 0 };
        topicPerformance[subject].total++;
        if (isAttempted) topicPerformance[subject].attempted++;
        if (isCorrect) topicPerformance[subject].correct++;
    }

    // Calculate weak areas (less than 50% correct)
    for (const [topicId, stats] of Object.entries(topicPerformance)) {
        if (stats.total > 0 && stats.correct / stats.total < 0.5) {
            weakAreas.push(topicId);
        }
    }

    // Check if result already exists to prevent duplicate submission
    const { data: existing } = await supabase.from('diagnostic_results').select('id').eq('attempt_id', attemptId).single();
    if (existing) {
        return { success: true };
    }

    // Build answer map for pattern analysis: questionId -> selected option letter
    const answerLetters: string[] = [];
    for (const q of questions) {
        const sel = userAnswers[q.id];
        answerLetters.push(sel || "");
    }

    const resultPayload = {
        attempt_id: attemptId,
        total_questions: questions.length,
        attempted_count: attemptedCount,
        correct_count: correctCount,
        topic_wise_performance: topicPerformance,
        concept_wise_performance: topicPerformance, // same as topic perf since subject-level
        weak_areas: weakAreas,
        interaction_data: {
            interactions: interactions || [],
            answerLetters, // ordered by question index
        },
    };

    const { error: resError } = await supabase.from('diagnostic_results').insert(resultPayload);

    if (resError) {
        console.error("Failed to insert diagnostic results:", resError);
        throw new Error("Failed to save results");
    }

    // Update onboarding status
    await supabase.from('profiles').update({ onboarding_status: 'DIAGNOSTIC_COMPLETED' }).eq('id', user.id);

    revalidatePath("/onboarding", "layout");
    return { success: true };
}

// ─── Analytics for Results Page ─────────────────────────────────────────

/**
 * Fetch and compute full analytics for the diagnostic results page.
 * Called from the complete page server component.
 */
export async function getAnalyticsForResults() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Fetch latest attempt with results AND total count of COMPLETED attempts
    const { data: attempt } = await supabase
        .from("diagnostic_attempts")
        .select("id, created_at, diagnostic_results(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    const { count: totalAttempts } = await supabase
        .from("diagnostic_attempts")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    if (!attempt) return null;

    const isResultsArray = Array.isArray(attempt.diagnostic_results);
    const hasResults = isResultsArray ? attempt.diagnostic_results.length > 0 : !!attempt.diagnostic_results;
    if (!hasResults) return null;

    const result: Record<string, any> = isResultsArray ? attempt.diagnostic_results[0] : attempt.diagnostic_results;

    const topicPerf = (result.topic_wise_performance || {}) as Record<string, { total: number; correct: number; attempted?: number }>;
    const weakAreas = (result.weak_areas || []) as string[];

    // Resolve chapter names for weak areas
    let chapterMap: Record<string, string> = {};
    let chapterSubjectMap: Record<string, string> = {};
    if (weakAreas.length > 0) {
        const { data: chapters } = await supabase
            .from('chapters')
            .select('chapter_code, chapter_name, subject')
            .in('chapter_code', weakAreas);
        if (chapters) {
            chapters.forEach(ch => {
                chapterMap[ch.chapter_code] = ch.chapter_name || ch.chapter_code;
                chapterSubjectMap[ch.chapter_code] = ch.subject || "General";
            });
        }
    }

    // Resolve top 5 chapters by weightage per subject
    const { data: topChaptersData } = await supabase
        .from('chapters')
        .select('chapter_name, subject, weightage_percent, chapter_code')
        .order('weightage_percent', { ascending: false });

    const topChaptersBySubject: Record<string, { name: string; weightage: number }[]> = {
        "Biology": [],
        "Physics": [],
        "Chemistry": []
    };

    if (topChaptersData) {
        topChaptersData.forEach(ch => {
            const sub = ch.subject || "General";
            if (topChaptersBySubject[sub] && topChaptersBySubject[sub].length < 5) {
                topChaptersBySubject[sub].push({
                    name: ch.chapter_name || ch.chapter_code,
                    weightage: parseFloat(ch.weightage_percent?.toString() || "0")
                });
            }
        });
    }

    // Compute time taken (from attempt created_at to result created_at)
    const startTime = new Date(attempt.created_at).getTime();
    const endTime = new Date(result.created_at).getTime();
    const timeTakenSeconds = Math.max(0, Math.floor((endTime - startTime) / 1000));

    // Extract interaction data if stored
    const interactionData = result.interaction_data as {
        interactions?: InteractionEvent[];
        answerLetters?: string[];
    } | null;

    const { computeDiagnosticAnalytics } = await import("@/lib/diagnostic-analytics");

    const analytics = computeDiagnosticAnalytics({
        totalQuestions: result.total_questions,
        attemptedCount: result.attempted_count ?? 0,
        correctCount: result.correct_count,
        topicWisePerformance: topicPerf,
        weakAreas,
        chapterMap,
        chapterSubjectMap,
        timeTakenSeconds,
        totalDurationSeconds: 30 * 60, // 30 minutes
        interactions: interactionData?.interactions || [],
        answerLetters: interactionData?.answerLetters || [],
        topChaptersBySubject,
        attemptCount: totalAttempts || 1,
    });

    return { ...analytics, attemptId: attempt.id };
}

/**
 * Raise a ticket to refresh (reset) the diagnostic test
 */
export async function raiseRefreshTicketAction(attemptId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Check if a pending ticket already exists for this attempt to prevent duplicates
    const { data: existing } = await supabase
        .from("diagnostic_test_refresh")
        .select("id")
        .eq("attempt_id", attemptId)
        .eq("status", "pending")
        .single();

    if (existing) {
        return { success: false, error: "A request for this attempt is already pending." };
    }

    // Get current iteration for this user
    const { count } = await supabase
        .from("diagnostic_test_refresh")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);

    const iteration = (count || 0) + 1;

    const { error } = await supabase.from("diagnostic_test_refresh").insert({
        user_id: user.id,
        email: user.email,
        phone: user.phone || null,
        attempt_id: attemptId,
        iteration,
        status: 'pending'
    });

    if (error) {
        console.error("Failed to raise refresh ticket:", error);
        return { success: false, error: "Failed to submit request. Please try again." };
    }

    return { success: true };
}

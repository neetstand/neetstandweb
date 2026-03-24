"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveOnboardingStep(data: {
    onboardingStatus?: string;
    diagnosticData?: any;
    targetExamYear?: number;
    attemptCount?: number;
    currentClass?: string;
    lastNeetScore?: number;
    averageMockScore?: number;
    subjectStrengths?: any;
    chapterStrengths?: any;
    generatedPlan?: any;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const updatePayload: any = {};
    if (data.onboardingStatus) updatePayload.onboarding_status = data.onboardingStatus;
    if (data.diagnosticData) updatePayload.diagnostic_data = data.diagnosticData;
    if (data.targetExamYear) updatePayload.target_exam_year = data.targetExamYear;
    if (data.attemptCount !== undefined) updatePayload.attempt_count = data.attemptCount;

    // New Fields
    if (data.currentClass) updatePayload.current_class = data.currentClass;
    if (data.lastNeetScore !== undefined) updatePayload.last_neet_score = data.lastNeetScore;
    if (data.averageMockScore !== undefined) updatePayload.average_mock_score = data.averageMockScore;
    if (data.subjectStrengths) updatePayload.subject_strengths = data.subjectStrengths;
    if (data.chapterStrengths) updatePayload.chapter_strengths = data.chapterStrengths;

    if (data.generatedPlan) {
        updatePayload.generated_plan = data.generatedPlan;

        // Determine the actual last_neet_score to use for routing.
        let finalScore = data.lastNeetScore;
        if (finalScore === undefined) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("last_neet_score")
                .eq("id", user.id)
                .single();
            finalScore = profile?.last_neet_score || 0;
        }

        let targetPlanName = "Groundbreaker Plan";
        const numericScore = finalScore || 0;
        if (numericScore >= 600) {
            targetPlanName = "Topper Plan";
        } else if (numericScore >= 450) {
            targetPlanName = "Challenger Plan";
        }

        // Fetch the corresponding Sprint Plan ID from DB
        const { data: activePlanData } = await supabase
            .from("sprint_plans")
            .select("id")
            .eq("name", targetPlanName)
            .single();

        if (activePlanData?.id) {
            updatePayload.active_sprint_plan_id = activePlanData.id;
        }
    }



    const { error } = await supabase
        .from("profiles")
        .upsert({
            id: user.id,
            ...updatePayload
        });

    if (error) {
        console.error("Error saving onboarding step:", error);
        throw new Error("Failed to save progress");
    }

    revalidatePath("/onboarding", 'layout');
}

export async function completeOnboarding() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            onboarding_status: "COMPLETED"
        })
        .eq("id", user.id);

    if (error) {
        console.error("Error completing onboarding:", error);
        throw new Error("Failed to complete onboarding");
    }

    redirect("/onboarding/plan");
}

export async function activatePlan(redirectTo: string = "/dashboard") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            has_paid: true, // Legacy flag, kept for backward compatibility for now
            onboarding_status: "COMPLETED"
        })
        .eq("id", user.id);

    // We no longer manually create user_plans here. 
    // Actual plan activation happens in webhook/payment success.
    // For legacy/skipped onboarding, we just handle the access flag above.

    if (error) {
        console.error("Error activating plan:", error);
        throw new Error("Failed to activate plan");
    }

    revalidatePath("/onboarding", "layout");
    revalidatePath("/dashboard", "layout"); // Bust the cache for the dashboard
    revalidatePath("/", "layout"); // Aggressively bust the entire app cache
    redirect(redirectTo);
}

export async function resetOnboarding() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            onboarding_status: "NOT_STARTED",
            current_class: null,
            last_neet_score: null,
            average_mock_score: null,
            diagnostic_data: null,
            subject_strengths: null,
            chapter_strengths: null,
            generated_plan: null,
            has_paid: false,
            attempt_count: 0
        })
        .eq("id", user.id);


    if (error) {
        console.error("Error resetting onboarding:", error);
        throw new Error(`Failed to reset onboarding: ${error.message}`);
    }

    revalidatePath("/onboarding", "layout");
    redirect("/onboarding/welcome");
}

export async function getChapters(subject: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
        .from("chapters")
        .select("chapter_name")
        .eq("subject", subject)
        .order("chapter_number", { ascending: true });

    if (error) {
        console.error("Error fetching chapters:", error);
        throw new Error(`Failed to fetch chapters: ${error.message}`);
    }

    return data.map((row) => row.chapter_name);
}

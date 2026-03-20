import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/onboarding/welcome");
    }

    // 1. Completed Onboarding
    const isCompleted = ["COMPLETED", "PLAN_GENERATED"].includes(profile.onboarding_status);
    if (isCompleted) {
        if (profile.has_paid) {
            redirect("/dashboard");
        } else {
            redirect("/onboarding/plan");
        }
    }

    // 2. Class 11 Flow
    if (profile.current_class === "11") {
        redirect("/onboarding/class-11");
    }

    // 3. Not Started / Identification Missing
    if (!profile.current_class) {
        redirect("/onboarding/welcome");
    }

    // 4. Split Flow for Repeaters vs Class 12
    const isRepeater = profile.current_class === "repeater";
    const isSkipped = profile.onboarding_status === "DIAGNOSTIC_SKIPPED";
    const isDiagTaken = profile.onboarding_status === "DIAGNOSTIC_COMPLETED";
    const isDiagStarted = profile.onboarding_status === "DIAGNOSTIC_STARTED";
    const hasDiagnostic = profile.diagnostic_data || isSkipped || isDiagTaken;
    const hasScore = (profile.last_neet_score != null) || (profile.average_mock_score != null);

    if (isDiagStarted) {
        redirect("/onboarding/diagnostic/test");
    }

    if (isRepeater) {
        // Repeaters enter score FIRST, then do diagnostic
        if (!hasScore) {
            redirect("/onboarding/analysis/score");
        }
        if (!hasDiagnostic) {
            redirect("/onboarding/diagnostic/intro");
        }
    } else {
        // Class 12 users do diagnostic FIRST, then enter score
        if (!hasDiagnostic) {
            redirect("/onboarding/diagnostic/intro");
        }
        if (!hasScore) {
            redirect("/onboarding/analysis/score");
        }
    }

    // 6. Detailed Analysis / Strength Input
    // If they have score but no subject strengths, go to strengths.
    if (!profile.subject_strengths) {
        redirect("/onboarding/analysis/strength");
    }

    // 7. Fallback / Final Step (Plan Generation)
    // If they have everything else, they are likely at the final step (Plan Generation).
    // Logic: If generated_plan exists, they should be completed (handled at top).
    // If not, they are at strength page (which has the generate button).
    redirect("/onboarding/analysis/strength");
}

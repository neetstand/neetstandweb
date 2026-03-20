import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getAvailableSprintPlans, getActiveSprintPlan } from "@/actions/sprintPlans";
import PlanPreviewClient from "./PlanPreviewClient";

export default async function PlanPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Redirect users who have already purchased a plan to the dashboard
    const { data: userPlans } = await supabase
        .from("user_plan_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);

    const { data: profileCheck } = await supabase
        .from("profiles")
        .select("has_paid")
        .eq("id", user.id)
        .single();

    if ((userPlans && userPlans.length > 0) || !!profileCheck?.has_paid) {
        return redirect("/dashboard/ncert-to-neet-30-days");
    }

    // Look up the active sprint plan assigned during the analysis step
    const { data: profile } = await supabase
        .from("profiles")
        .select("active_sprint_plan_id")
        .eq("id", user.id)
        .single();

    const activePlanId = profile?.active_sprint_plan_id || null;
    const availablePlans = await getAvailableSprintPlans();

    // Default to the first plan if no plan was assigned
    const fallbackPlanId = availablePlans.length > 0 ? availablePlans[0].id : null;
    const planToFetch = activePlanId || fallbackPlanId;
    const { data: plansData } = await supabase.from('plans').select('*, plan_pricing(*)').eq('is_active', true);

    const activePlanDetails = planToFetch ? await getActiveSprintPlan(planToFetch) : null;

    const displayName =
        user.user_metadata?.full_name?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        undefined;

    // By definition, if they are still in the onboarding preview form, they haven't activated yet.
    const hasActivated = false;

    const dashboardProps = {
        userName: displayName,
        availablePlans,
        activePlanId: planToFetch,
        hasActivated,
        plansData: plansData || [],
        userId: user.id,
    };

    return <PlanPreviewClient dashboardProps={dashboardProps} />;
}

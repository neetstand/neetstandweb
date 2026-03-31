import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SprintDashboard from "./SprintDashboard";
import PhysicsSprintDashboard from "./PhysicsSprintDashboard";
import ChemistrySprintDashboard from "./ChemistrySprintDashboard";
import BiologySprintDashboard from "./BiologySprintDashboard";
import { getAvailableSprintPlans, getActiveSprintPlan } from "@/actions/sprintPlans";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("active_sprint_plan_id")
        .eq("id", user.id)
        .single();

    const activePlanId = profile?.active_sprint_plan_id || null;

    const availablePlans = await getAvailableSprintPlans();

    // Default to the Topper Plan if user has no plan selected
    const fallbackPlanId = availablePlans.length > 0 ? availablePlans[0].id : null;
    const planToFetch = activePlanId || fallbackPlanId;

    const activePlanDetails = planToFetch ? await getActiveSprintPlan(planToFetch) : null;

    const displayName =
        user.user_metadata?.full_name?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        undefined;

    // Everything is completely free now
    const hasActivated = true;
    const activatedSubjects = ["physics", "chemistry", "biology"];
    const activeProductString = "30 Day Sprint Plan";
    const plansData: any[] = [];

    const commonProps = {
        userName: displayName,
        availablePlans,
        activePlanId: planToFetch,
        activePlan: activePlanDetails,
        hasActivated,
        activatedSubjects,
        activeProductString,
        userId: user.id,
    };

    // If they only have one subject activated, show that specific subject dashboard
    if (activatedSubjects?.length === 1) {
        if (activatedSubjects[0] === "physics") {
            return <PhysicsSprintDashboard {...commonProps} plansData={plansData || []} />;
        } else if (activatedSubjects[0] === "chemistry") {
            return <ChemistrySprintDashboard {...commonProps} plansData={plansData || []} />;
        } else if (activatedSubjects[0] === "biology") {
            return <BiologySprintDashboard {...commonProps} plansData={plansData || []} />;
        }
    }

    return <SprintDashboard {...commonProps} plansData={plansData || []} />;
}

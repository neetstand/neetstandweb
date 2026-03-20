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

    // Fetch product pricing plans
    const { data: plansData } = await supabase.from('plans').select('*');

    // Default to the Topper Plan (which we assume is first) if user has no plan selected
    const fallbackPlanId = availablePlans.length > 0 ? availablePlans[0].id : null;
    const planToFetch = activePlanId || fallbackPlanId;

    const activePlanDetails = planToFetch ? await getActiveSprintPlan(planToFetch) : null;

    const displayName =
        user.user_metadata?.full_name?.split(" ")[0] ||
        user.email?.split("@")[0] ||
        undefined;

    // Check plan activation status
    const { data: userPlans } = await supabase
        .from("user_plan_purchases")
        .select("status, plans(plan_name)")
        .eq("user_id", user.id)
        .eq("status", "active");

    let activatedSubjects: string[] | null = null;
    let hasActivated = false;
    let activeProductString: string | null = null;

    if (userPlans && userPlans.length > 0) {
        hasActivated = true;

        const mappedPlans = userPlans.map(p => ({
            plan_name: (p.plans as any)?.plan_name
        }));

        // Find the most relevant purchased product to act as their "active" product for UI purposes
        // Sort to prefer full bundles if they have multiple
        const sortedPlans = [...mappedPlans].sort((a, b) => {
            const isAFull = ["30 Day Sprint Plan", "Groundbreaker Plan", "Challenger Plan", "Topper Plan"].includes(a.plan_name);
            const isBFull = ["30 Day Sprint Plan", "Groundbreaker Plan", "Challenger Plan", "Topper Plan"].includes(b.plan_name);
            return (isAFull === isBFull) ? 0 : isAFull ? -1 : 1;
        });

        activeProductString = sortedPlans[0].plan_name;

        const hasFullBundle = sortedPlans.some(p =>
            p.plan_name === "30 Day Sprint Plan" ||
            p.plan_name === "Groundbreaker Plan" ||
            p.plan_name === "Challenger Plan" ||
            p.plan_name === "Topper Plan"
        );

        if (hasFullBundle) {
            activatedSubjects = ["physics", "chemistry", "biology"];
        } else {
            activatedSubjects = [];
            if (sortedPlans.some(p => p.plan_name === "30 Day Physics" || p.plan_name?.includes("Physics"))) activatedSubjects.push("physics");
            if (sortedPlans.some(p => p.plan_name === "30 Day Chemistry" || p.plan_name?.includes("Chemistry"))) activatedSubjects.push("chemistry");
            if (sortedPlans.some(p => p.plan_name === "30 Day Biology" || p.plan_name?.includes("Biology"))) activatedSubjects.push("biology");
        }
    }

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

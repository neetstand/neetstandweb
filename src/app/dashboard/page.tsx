import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardLandingClient from "./DashboardLandingClient";

export default async function DashboardGate() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Check for an active user plan purchase
    const { data: userPlans } = await supabase
        .from("user_plan_purchases")
        .select("status, plans(plan_name)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

    const hasActivated = Boolean(userPlans && userPlans.length > 0);
    const planName = (userPlans?.[0]?.plans as any)?.plan_name ?? null;

    return <DashboardLandingClient hasActivated={hasActivated} planName={planName} />;
}

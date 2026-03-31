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

    const hasActivated = true;
    const planName = "30 Day Sprint Plan";

    return <DashboardLandingClient hasActivated={hasActivated} planName={planName} />;
}

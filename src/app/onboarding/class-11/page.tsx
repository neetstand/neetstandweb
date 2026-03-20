import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Class11Content } from "./Class11Content";

export default async function Class11Page() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_status")
        .eq("id", user.id)
        .single();

    const isWaitlisted = profile?.onboarding_status === "CLASS_11_WAITLIST";

    return <Class11Content initialNotified={isWaitlisted} />;
}

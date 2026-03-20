import { createClient } from "@/utils/supabase/server";
import { ScoreInputForm } from "./ScoreInputForm";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function ScorePage() {
    await connection(); // Opt into dynamic rendering to wipe cache correctly in Next.js 15+

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("current_class, last_neet_score, average_mock_score")
        .eq("id", user.id)
        .single();

    const isRepeater = profile?.current_class === "repeater";

    return (
        <StepLayout progress={70} showBack={true} backHref="/onboarding/identification" className="-translate-y-10">
            <div className="space-y-6 max-w-lg text-center w-full">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
                    {isRepeater ? "What was your last NEET score?" : "What is your current average mock score?"}
                </h1>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                    We will not verify or share. This is only to help you better.
                </p>

                <ScoreInputForm
                    isRepeater={isRepeater}
                    initialScore={profile?.last_neet_score}
                    initialMockScore={profile?.average_mock_score}
                />
            </div>
        </StepLayout>
    );
}

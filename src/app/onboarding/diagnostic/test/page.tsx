import { getDiagnosticState } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DiagnosticTestClient } from "./DiagnosticTestClient";

export default async function DiagnosticTestPage() {
    const state = await getDiagnosticState();

    if (state.status === "NOT_STARTED") {
        redirect("/onboarding/diagnostic/intro");
    }

    if (state.status === "COMPLETED") {
        redirect("/onboarding/diagnostic/complete");
    }

    const supabase = await createClient();

    // Fetch the 30 active questions for this attempt
    const { data: questions, error } = await supabase
        .from("diagnostic_questions")
        .select(`
            id,
            subject,
            option_a (id, statement_text, subject),
            option_b (id, statement_text, subject),
            option_c (id, statement_text, subject),
            option_d (id, statement_text, subject)
        `)
        .eq("attempt_id", state.attemptId)
        .order("created_at", { ascending: true });

    if (error || !questions || questions.length === 0) {
        console.error("Failed to load diagnostic questions:", error);
        // Fallback if broken data
        redirect("/onboarding/diagnostic/intro");
    }

    // Format for the client
    const formattedQuestions = questions.map((q: any) => ({
        id: q.id,
        subject: q.option_a?.subject || "General",
        options: {
            A: q.option_a?.statement_text,
            B: q.option_b?.statement_text,
            C: q.option_c?.statement_text,
            D: q.option_d?.statement_text,
        }
    }));

    return (
        <DiagnosticTestClient
            attemptId={state.attemptId!}
            startedAt={state.createdAt!}
            questions={formattedQuestions}
        />
    );
}

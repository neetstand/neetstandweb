import { redirect } from "next/navigation";
import { getAnalyticsForResults } from "../actions";
import { DiagnosticResultsClient } from "./DiagnosticResultsClient";

export default async function DiagnosticCompletePage() {
    const analytics = await getAnalyticsForResults();

    if (!analytics) {
        redirect("/onboarding/diagnostic/intro");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start justify-center p-4 pt-8 sm:pt-12 font-sans">
            <DiagnosticResultsClient analytics={analytics} />
        </div>
    );
}

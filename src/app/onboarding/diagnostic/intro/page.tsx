import { StepLayout } from "@/components/onboarding/StepLayout";
import { DiagnosticIntroActions } from "./DiagnosticIntroActions";
import { getDiagnosticState } from "../actions";
import { AlertCircle, Flame } from "lucide-react";

export default async function DiagnosticIntroPage() {
    const diagnosticState = await getDiagnosticState();


    return (
        <StepLayout progress={30} showBack={false} backHref="/onboarding/identification" className="-translate-y-10">
            <div className="space-y-6 max-w-lg text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    <Flame className="w-3 h-3" />
                    Diagnostic Phase
                </div>

                <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-slate-50 leading-[1.1]">
                    Assess Your Current Level
                </h1>

                <p className="text-lg text-gray-600 dark:text-slate-400 font-medium">
                    Start with a short diagnostic test to build your personalized 30-day improvement plan.
                </p>

                {/* Details Box */}
                <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-6 w-full max-w-xs mx-auto shadow-sm">
                    <ul className="space-y-3 text-left text-gray-700 dark:text-slate-300 font-medium">
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-black dark:bg-slate-400 rounded-full" />
                            <span>30 Questions</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-black dark:bg-slate-400 rounded-full" />
                            <span>30 Minutes Total</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span>15 Biology</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <span>8 Chemistry</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            <span>7 Physics</span>
                        </li>
                    </ul>
                </div>

                <p className="text-sm text-gray-400 dark:text-slate-500 font-medium uppercase tracking-wide">
                    This is not an exam. This is direction.
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-500 font-medium px-4">
                    Note: No negative marking—this test is only for your personalized analysis, not a NEET score.
                </p>

                <DiagnosticIntroActions />
            </div>
        </StepLayout>
    );
}

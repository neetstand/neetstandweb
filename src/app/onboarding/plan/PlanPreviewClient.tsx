"use client";

import { useState, useEffect } from "react";
import SprintDashboard from "@/app/dashboard/ncert-to-neet-30-days/SprintDashboard";
import { CheckoutModal } from "@/app/dashboard/ncert-to-neet-30-days/components/CheckoutModal";
import { Atom, FlaskConical, Leaf } from "lucide-react";

type Subject = "physics" | "chemistry" | "biology";

export default function PlanPreviewClient({ dashboardProps }: { dashboardProps: any }) {
    const [generating, setGenerating] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();

    useEffect(() => {
        const timer = setTimeout(() => {
            setGenerating(false);
            setShowCheckout(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    if (generating) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
                <div className="flex flex-col items-center space-y-6 animate-pulse">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black dark:border-slate-800 dark:border-t-emerald-500 rounded-full animate-spin" />
                    <div className="text-xl font-medium text-gray-600 dark:text-slate-300 space-y-2 text-center">
                        <p>Analyzing performance...</p>
                        <p className="delay-75">Mapping NCERT gaps...</p>
                        <p className="delay-150">Designing structured improvement blocks...</p>
                    </div>
                </div>
            </div>
        );
    }

    const subjectPlans: { subject: Subject; label: string; icon: React.ElementType; active: string; inactive: string }[] = [
        {
            subject: "physics",
            label: "Physics",
            icon: Atom,
            active: "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 ring-2 ring-sky-400 ring-offset-2 dark:ring-offset-slate-950",
            inactive: "bg-white dark:bg-slate-800/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-700/50 hover:bg-sky-50 dark:hover:bg-sky-900/30",
        },
        {
            subject: "chemistry",
            label: "Chemistry",
            icon: FlaskConical,
            active: "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 ring-2 ring-violet-400 ring-offset-2 dark:ring-offset-slate-950",
            inactive: "bg-white dark:bg-slate-800/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/30",
        },
        {
            subject: "biology",
            label: "Biology",
            icon: Leaf,
            active: "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-950",
            inactive: "bg-white dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
        },
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 w-full h-full">

            {/* Checkout modal — only opened from within the dashboard */}
            <CheckoutModal
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                plansData={dashboardProps.plansData || []}
            />

            {/* Introduction Block */}
            <div className="border-b border-emerald-500/20 w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-950 shadow-sm relative z-10">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 drop-shadow-sm max-w-4xl tracking-tight">
                    Your Personalized 30-Day Blueprint is Ready
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-sky-200/90 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">
                    Scroll below to explore your plan. Click a subject to preview its specific 30-day breakdown.
                    <br /><span className="text-emerald-600 dark:text-emerald-400 font-bold mt-3 block text-xl">Unlock a plan to instantly get full access and start mastering NEET today.</span>
                </p>

                {/* Subject Plan Buttons — switch plan view below */}
                <div className="w-full max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">
                            * Click to see Individual Plans
                        </p>
                        {selectedSubject && (
                            <button
                                onClick={() => setSelectedSubject(undefined)}
                                className="text-xs font-semibold text-sky-500 hover:text-sky-400 transition-colors underline underline-offset-2"
                            >
                                Show All
                            </button>
                        )}
                    </div>
                    <div className="flex flex-row gap-3">
                        {subjectPlans.map(({ subject, label, icon: Icon, active, inactive }) => {
                            const isActive = selectedSubject === subject;
                            return (
                                <button
                                    key={subject}
                                    onClick={() => setSelectedSubject(isActive ? undefined : subject)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 active:scale-95 ${isActive ? active : inactive}`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {label} Plan
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Dashboard Component — subjectFocus drives the plan filter */}
            <div className="w-full relative z-0">
                <SprintDashboard
                    {...dashboardProps}
                    subjectFocus={selectedSubject}
                    onOpenCheckout={() => setShowCheckout(true)}
                />
            </div>
        </div>
    );
}


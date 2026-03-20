"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, BookOpen, Activity, Loader2 } from "lucide-react";
import { activatePlan } from "../onboarding/actions";

export default function DashboardLandingClient({ hasActivated, planName }: { hasActivated?: boolean; planName?: string | null }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Derive display info from the plan that was purchased
    const getPlanDisplay = () => {
        if (!planName) return { title: "NCERT to NEET: 30-Day Sprint", subtitle: "All subjects • High-yield curriculum" };
        if (planName.includes("Physics")) return { title: "30 Day Physics Sprint", subtitle: "Physics only • Mechanics, Electromagnetism & Modern Physics" };
        if (planName.includes("Chemistry")) return { title: "30 Day Chemistry Sprint", subtitle: "Chemistry only • Physical, Organic & Inorganic Chemistry" };
        if (planName.includes("Biology")) return { title: "30 Day Biology Sprint", subtitle: "Biology only • Botany & Zoology NCERT focus" };
        return { title: "NCERT to NEET: 30-Day Sprint", subtitle: "All subjects • High-yield curriculum" };
    };
    const planDisplay = getPlanDisplay();

    const handleCardClick = () => {
        if (hasActivated) {
            router.push('/dashboard/ncert-to-neet-30-days');
        } else {
            startTransition(async () => {
                await activatePlan('/dashboard/ncert-to-neet-30-days');
            });
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#FAFAFC] dark:bg-[#0A0A0B] flex flex-col items-center justify-center p-6 md:p-12 font-sans selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Ultra-subtle background gradients for premium depth */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-[100%] pointer-events-none opacity-50 dark:opacity-20" />

            <div className="w-full max-w-4xl mx-auto flex flex-col relative z-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
                            System Online
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                        <>NEETStand is ready,<br className="hidden md:block" />
                            <span className="text-slate-500 dark:text-slate-400 font-medium">are you?</span>
                        </>
                    </h1>
                </motion.div>

                {/* Sleek Plan Entry Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onClick={handleCardClick}
                    className={`group relative w-full bg-white dark:bg-[#111112] rounded-3xl border shadow-sm transition-all duration-500 overflow-hidden p-8 md:p-10 ${isPending ? "opacity-70 cursor-not-allowed border-indigo-200 dark:border-indigo-500/30" : "border-slate-200/80 dark:border-slate-800/80 hover:shadow-[0_8px_30px_-4px_rgba(79,70,229,0.1)] dark:shadow-none dark:hover:border-indigo-500/30 cursor-pointer"
                        }`}
                >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10 w-full">

                        {/* Content Left */}
                        <div className="flex items-start sm:items-center gap-6 flex-1">

                            {/* Icon Container with subtle gradient */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 group-hover:scale-[1.03] group-hover:shadow-md transition-all duration-500">
                                <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400 translate-y-[1px]" />
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${hasActivated
                                            ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20"
                                            : "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20"
                                        }`}>
                                        {hasActivated ? "Active Plan" : "Available Plan"}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                    {planDisplay.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    {planDisplay.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Action Right */}
                        <div className="flex items-center justify-end w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t border-slate-100 dark:border-slate-800/50 md:border-none">
                            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-300">
                                <span>{isPending ? "Activating..." : (hasActivated ? "Continue" : "Let's Start")}</span>
                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 dark:group-hover:border-indigo-500 transition-all duration-300">
                                    {isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500 dark:text-indigo-400 group-hover:text-white" />
                                    ) : (
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* Bottom Helper Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 px-2"
                >
                    <button onClick={() => router.push('/profile')} className="text-sm text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 group cursor-pointer">
                        <Activity className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-current transition-colors" />
                        Manage Profile
                    </button>
                    <button onClick={() => router.push('/dashboard/plans')} className="text-sm text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors flex items-center gap-1.5 group cursor-pointer">
                        <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-current transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        Billing & Plans
                    </button>
                </motion.div>

            </div>
        </div>
    );
}

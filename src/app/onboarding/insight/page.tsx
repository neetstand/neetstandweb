"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Lock, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InsightPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate "Calculating..." phase
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleUnlock = async () => {
        router.push("/onboarding");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-8 min-h-[50vh]">
                <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800 opacity-30"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin blur-sm"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                        <TrendingUp size={32} />
                    </div>
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 animate-pulse">
                        Analyzing Performance Architecture...
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Comparing with 10 years of topper patterns</p>
                </div>
            </div>
        );
    }

    const currentBand = "450 - 520";
    const projectedBand = "640 - 680";
    const lostMarks = "120-140";

    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 50
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl mx-auto space-y-12 text-center"
        >
            <div className="space-y-6">
                <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold tracking-wide uppercase">
                    <CheckCircle2 size={16} /> Analysis Complete
                </motion.div>
                <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold tracking-tight">
                    You are in the <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400">Optimization Zone</span>
                </motion.h1>
                <motion.p variants={item} className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                    Based on patterns from previous NEET toppers, here is your current trajectory versus your true potential.
                </motion.p>
            </div>

            <motion.div variants={item} className="grid md:grid-cols-3 gap-6 auto-rows-fr">
                {/* Current Status */}
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-300 dark:bg-slate-700" />
                    <div className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-3">Current Trajectory</div>
                    <div className="text-4xl md:text-5xl font-bold text-slate-700 dark:text-slate-300 tracking-tight">{currentBand}</div>
                    <div className="text-slate-400 text-sm mt-2 font-medium">Predicted Score Range</div>
                </div>

                {/* Leakage */}
                <div className="group p-8 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 shadow-xl shadow-red-500/5 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <AlertTriangle size={120} className="text-red-500" />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                    <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <AlertTriangle size={14} /> Leakage Detected
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight">{lostMarks}</div>
                    <div className="text-red-500/80 text-sm mt-2 font-medium">Marks lost in high-yield topics</div>
                </div>

                {/* Potential */}
                <div className="group p-8 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 shadow-xl shadow-emerald-500/5 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp size={120} className="text-emerald-500" />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-sky-500" />

                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3">
                        <TrendingUp size={14} /> True Potential
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{projectedBand}</div>
                    <div className="text-emerald-600/80 text-sm mt-2 font-medium">Achievable with Precision Plan</div>
                </div>
            </motion.div>

            <motion.div variants={item} className="pt-8 pb-12">
                <button
                    onClick={handleUnlock}
                    className="group relative inline-flex items-center justify-center px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-lg font-bold hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 w-full md:w-auto overflow-hidden"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

                    <Lock size={20} className="mr-3 group-hover:hidden transition-all" />
                    <span className="group-hover:hidden">Unlock My Precision Plan</span>

                    <span className="hidden group-hover:inline-flex items-center text-emerald-500 dark:text-emerald-600">
                        Go to Dashboard <ArrowRight size={20} className="ml-2" />
                    </span>
                </button>
                <p className="mt-6 text-sm text-slate-400 font-medium">
                    This will create your personalized dashboard.
                </p>
            </motion.div>
        </motion.div>
    );
}

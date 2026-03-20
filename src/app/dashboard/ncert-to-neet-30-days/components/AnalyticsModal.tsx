"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, BarChart3, Target, Activity, CheckCircle2, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export function AnalyticsModal({
    isOpen,
    onClose,
    completedDays,
}: {
    isOpen: boolean;
    onClose: () => void;
    completedDays: number;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const totalDays = 30;
    const progress = Math.round((completedDays / totalDays) * 100);

    // Derived mockup mock scores to look incredibly cool
    const predictedScore = 410 + (progress * 2.8); // Scale dynamically from 410 to ~690

    const subjectProgress = [
        { name: "Physics", val: progress > 0 ? progress - 2 : 0, color: "bg-sky-500 shadow-sky-500/30", text: "text-sky-500" },
        { name: "Chemistry", val: progress > 0 ? progress + 4 : 0, color: "bg-violet-500 shadow-violet-500/30", text: "text-violet-500" },
        { name: "Biology", val: progress > 0 ? progress + 8 : 0, color: "bg-emerald-500 shadow-emerald-500/30", text: "text-emerald-500" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
                    >
                        {/* Header Background */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-purple-600 to-blue-600 opacity-10 dark:opacity-20" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
                        <div className="absolute top-10 -left-20 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />

                        <div className="relative p-6 sm:p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20 text-white">
                                        <BarChart3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Performance Analytics</h2>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Your advanced progress mapping & predicted trajectory.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Top Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-full" />
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> +15 Pts
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{Math.round(predictedScore)}</h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Predicted Score</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-bl-full" />
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{progress}%</h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Syllabus Completion</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                    <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-bl-full" />
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
                                            <Award className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                                            Top 12%
                                        </h3>
                                        <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mt-1">Peer Percentile</p>
                                    </div>
                                </div>
                            </div>

                            {/* Lower Grid: Subject Breakdown & Chart */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Subject Breakdown */}
                                <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                                        Subject-wise Completion
                                    </h3>

                                    <div className="space-y-6">
                                        {subjectProgress.map((subj, i) => (
                                            <div key={subj.name}>
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{subj.name}</span>
                                                    <span className={cn("text-xs font-bold", subj.text)}>{Math.max(0, Math.min(100, subj.val))}%</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.max(0, Math.min(100, subj.val))}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                                        className={cn("h-full rounded-full shadow-lg", subj.color)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mock Projection Chart */}
                                <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 flex flex-col">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-sky-500" />
                                        Score Trajectory Forecast
                                    </h3>

                                    <div className="flex-1 min-h-[160px] flex items-end justify-between gap-2 border-b border-gray-100 dark:border-slate-700/50 pb-2 relative">
                                        {/* Mock dynamic bars */}
                                        {[380, 410, 405, 450, 480, 520, Math.round(predictedScore)].map((val, idx, arr) => {
                                            const isLast = idx === arr.length - 1;
                                            const heightPct = (val / 720) * 100;

                                            return (
                                                <div key={idx} className="flex flex-col items-center gap-2 relative group w-full">
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] py-1 px-2 rounded font-bold z-10 pointer-events-none">
                                                        {val}
                                                    </div>

                                                    {/* The bar */}
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${heightPct}%` }}
                                                        transition={{ duration: 0.8, delay: 0.2 + (idx * 0.05), ease: "easeOut" }}
                                                        className={cn(
                                                            "w-full max-w-[32px] rounded-t-lg transition-colors",
                                                            isLast ? "bg-gradient-to-t from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20" : "bg-gray-200 dark:bg-slate-700 group-hover:bg-gray-300 dark:group-hover:bg-slate-600"
                                                        )}
                                                    />

                                                    <div className={cn(
                                                        "text-[10px] font-medium",
                                                        isLast ? "text-purple-600 dark:text-purple-400 font-bold" : "text-gray-400 dark:text-slate-500"
                                                    )}>
                                                        {isLast ? "Proj." : `Wk ${idx + 1}`}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { X, Clock, Target, CheckCircle2, XCircle, TrendingUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export type SprintResultQuestion = {
    question_order: number;
    question_text: string;
    is_correct: boolean;
    time_spent: number; // in seconds
    difficulty: "Easy" | "Medium" | "Hard";
};

export interface SprintAnalysisProps {
    isOpen: boolean;
    onClose: () => void;
    results: SprintResultQuestion[];
    totalTimeSpent: number; // in seconds
    totalSprintTime: number; // typically 600s for a 10 min sprint
}

export function SprintAnalysisModal({
    isOpen,
    onClose,
    results,
    totalTimeSpent,
    totalSprintTime = 600,
}: SprintAnalysisProps) {
    if (!isOpen) return null;

    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.is_correct).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Average time ignoring unanswered/unspent
    const validTimes = results.filter(r => r.time_spent > 0).map(r => r.time_spent);
    const avgTime = validTimes.length > 0 ? Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length) : 0;

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
                    >
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 sm:px-8 text-white relative shrink-0">
                            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                                <TrendingUp className="w-32 h-32" />
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>

                            <h2 className="text-2xl font-bold mb-1">10-Minute Sprint Analysis</h2>
                            <p className="text-orange-50/80">Detailed breakdown of your rapid-fire performance.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 relative z-10">
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                    <div className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Target size={14} /> Accuracy</div>
                                    <div className="text-3xl font-black">{accuracy}%</div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                    <div className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><CheckCircle2 size={14} /> Score</div>
                                    <div className="text-3xl font-black">{correctAnswers} <span className="text-lg font-medium opacity-70">/ {totalQuestions}</span></div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                    <div className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock size={14} /> Time Spent</div>
                                    <div className="text-3xl font-black">{formatTime(totalTimeSpent)}</div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                    <div className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"><Clock size={14} /> Avg. Speed</div>
                                    <div className="text-3xl font-black">{avgTime}s <span className="text-lg font-medium opacity-70">/ q</span></div>
                                </div>
                            </div>
                        </div>

                        {/* List View of Questions */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50 dark:bg-slate-950">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Question Breakdown</h3>

                            <div className="space-y-4">
                                {results.map((req, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 sm:items-center">

                                        <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full font-bold text-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                                            Q{req.question_order}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* Truncated text of question for quick parsing */}
                                            <div
                                                className="text-sm text-gray-700 dark:text-slate-300 line-clamp-2 font-medium mb-2"
                                                dangerouslySetInnerHTML={{ __html: req.question_text || "Question content hidden." }}
                                            />
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                                                    req.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                                        req.difficulty === "Medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                                                            "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                                                )}>
                                                    {req.difficulty}
                                                </span>

                                                <span className={cn(
                                                    "flex items-center gap-1 text-[11px] font-semibold",
                                                    req.time_spent > 60 ? "text-red-500" : "text-sky-500"
                                                )}>
                                                    <Clock size={12} />
                                                    {req.time_spent}s
                                                </span>
                                            </div>
                                        </div>

                                        <div className="shrink-0 flex items-center justify-end sm:w-32">
                                            {req.is_correct ? (
                                                <div className="flex flex-col items-center sm:items-end text-emerald-500">
                                                    <CheckCircle2 size={28} className="drop-shadow-sm mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Correct</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center sm:items-end text-red-500">
                                                    <XCircle size={28} className="drop-shadow-sm mb-1" />
                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Incorrect</span>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

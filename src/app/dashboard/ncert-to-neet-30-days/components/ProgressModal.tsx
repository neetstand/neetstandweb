"use client";

import { useEffect, useState } from "react";
import { X, BookOpen, Activity, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

import { getUserStrategyData } from "@/actions/strategy";

type SubjectKey = "Physics" | "Chemistry" | "Biology";

const SUBJECT_COLORS = {
    Physics: { border: "border-sky-200 dark:border-sky-800", bg: "bg-sky-50 dark:bg-sky-900/10", bar: "bg-sky-500", text: "text-sky-600 dark:text-sky-400", tabActive: "bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500" },
    Chemistry: { border: "border-violet-200 dark:border-violet-800", bg: "bg-violet-50 dark:bg-violet-900/10", bar: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", tabActive: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500" },
    Biology: { border: "border-emerald-200 dark:border-emerald-800", bg: "bg-emerald-50 dark:bg-emerald-900/10", bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", tabActive: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500" },
};

export function ProgressModal({
    isOpen,
    onClose,
    activatedSubjects = null,
}: {
    isOpen: boolean;
    onClose: () => void;
    activatedSubjects?: string[] | null;
}) {
    const [mounted, setMounted] = useState(false);

    // Determine the available subjects based on plan
    const availableSubjects = (["Physics", "Chemistry", "Biology"] as SubjectKey[]).filter(subj => {
        if (!activatedSubjects || activatedSubjects.length === 0) return true; // full plan or unknown
        return activatedSubjects.includes(subj.toLowerCase());
    });

    const [activeSubject, setActiveSubject] = useState<SubjectKey>(availableSubjects[0] || "Physics");
    const [isLoading, setIsLoading] = useState(false);
    const [liveData, setLiveData] = useState<Record<SubjectKey, { chapter: string; progress: number }[]>>({
        Physics: [],
        Chemistry: [],
        Biology: [],
    });

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

    useEffect(() => {
        async function fetchStrategy() {
            if (!isOpen) return;
            setIsLoading(true);
            try {
                const data = await getUserStrategyData();
                if (data && data.length > 0) {
                    const grouped: Record<SubjectKey, { chapter: string; progress: number }[]> = {
                        Physics: [],
                        Chemistry: [],
                        Biology: [],
                    };
                    data.forEach(d => {
                        const validSubject = d.subject as SubjectKey;
                        if (grouped[validSubject]) {
                            grouped[validSubject].push({
                                chapter: d.chapter_name,
                                progress: d.progress
                            });
                        }
                    });
                    setLiveData(grouped);
                }
            } catch (err) {
                console.error("Failed to load strategy", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStrategy();
    }, [isOpen]);

    if (!mounted) return null;

    const currentColors = SUBJECT_COLORS[activeSubject];
    const currentChapters = liveData[activeSubject];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
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
                        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
                    >
                        {/* Header Background */}
                        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-blue-600 to-sky-600 opacity-10 dark:opacity-20 pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />

                        {/* Modal Header & Tabs (Fixed at Top) */}
                        <div className="relative p-6 sm:px-8 sm:pt-8 sm:pb-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Topicwise Strategy</h2>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Your strengths and targeted focus areas based on recent performance.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Subject Tabs */}
                            <div className="flex gap-2 p-1 bg-gray-50 dark:bg-slate-800/50 rounded-xl overflow-x-auto no-scrollbar border border-gray-100 dark:border-slate-700/50">
                                {availableSubjects.map((subj) => {
                                    const isActive = activeSubject === subj;
                                    const tabColors = SUBJECT_COLORS[subj] || SUBJECT_COLORS.Physics;
                                    return (
                                        <button
                                            key={subj}
                                            onClick={() => setActiveSubject(subj)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all whitespace-nowrap border border-transparent",
                                                isActive ? tabColors.tabActive : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            <BookOpen className="w-4 h-4" />
                                            {subj}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/50 dark:bg-slate-900/50 space-y-4">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={activeSubject}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                        "p-6 rounded-2xl border-2 shadow-sm",
                                        currentColors.bg,
                                        currentColors.border
                                    )}
                                >
                                    <h3 className={cn("text-lg font-bold mb-6 flex items-center gap-2", currentColors.text)}>
                                        <Target className="w-5 h-5" />
                                        {activeSubject} Strengths Overview
                                    </h3>

                                    {isLoading ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-sky-500 animate-spin mb-4" />
                                            <p>Analyzing performance...</p>
                                        </div>
                                    ) : currentChapters.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <div className={cn("w-16 h-16 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm mb-4", currentColors.text)}>
                                                <Target size={32} />
                                            </div>
                                            <h4 className="text-gray-700 dark:text-slate-300 font-bold mb-1">No Data Yet</h4>
                                            <p className="text-gray-500 text-sm max-w-sm">Complete practice sessions in {activeSubject} to uncover your hidden strengths and strategy recommendations.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            {/* Sort chapters by descending progress to build confidence by showing strongest first */}
                                            {[...currentChapters].sort((a, b) => b.progress - a.progress).map((ch, i) => {
                                                const isMastered = ch.progress >= 80;
                                                const isOnTrack = ch.progress >= 60 && ch.progress < 80;

                                                // Dynamic bar coloring overriding the default subject color to express strength
                                                const barColor = isMastered
                                                    ? "bg-emerald-500"
                                                    : isOnTrack
                                                        ? "bg-blue-500"
                                                        : "bg-orange-500";

                                                const labelText = isMastered ? "Strong" : isOnTrack ? "On Track" : "Needs Review";
                                                const labelColor = isMastered
                                                    ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-800"
                                                    : isOnTrack
                                                        ? "text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/20 border-blue-200 dark:border-blue-800"
                                                        : "text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-500/20 border-orange-200 dark:border-orange-800";

                                                return (
                                                    <div key={ch.chapter} className="relative group p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                                                        <div className="flex justify-between items-end mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{ch.chapter}</span>
                                                                {/* Confidence badging */}
                                                                <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border", labelColor)}>
                                                                    {labelText}
                                                                </span>
                                                            </div>
                                                            <span className={cn("text-sm font-black leading-none", currentColors.text)}>
                                                                {ch.progress}%
                                                            </span>
                                                        </div>

                                                        {/* Horizontal Bar */}
                                                        <div className="h-4 w-full bg-white dark:bg-slate-800 ring-1 ring-inset ring-black/5 dark:ring-white/5 rounded-full overflow-hidden relative shadow-inner">
                                                            {/* Animated Fill Indicator */}
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${Math.max(2, ch.progress)}%` }} // Minimum width for visibility
                                                                viewport={{ once: true, margin: "-20px" }}
                                                                transition={{ duration: 0.8, delay: i * 0.05, type: "spring", bounce: 0.2 }}
                                                                className={cn(
                                                                    "h-full rounded-full relative z-10 transition-colors shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]",
                                                                    barColor
                                                                )}
                                                            >
                                                                {/* Gloss highlight inside the bar */}
                                                                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer decorative border */}
                        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 shrink-0" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

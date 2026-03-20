"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target, TrendingUp, Zap, Brain, ChevronRight, RotateCcw, Lock,
    AlertTriangle, CheckCircle2, BarChart3, ArrowUpRight, Sparkles, Shield,
    Info, X, Flame, BookOpen, GraduationCap, ChevronDown, AlertCircle, Loader2
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { DiagnosticAnalytics } from "@/lib/diagnostic-analytics";
import Link from "next/link";
import React from "react";
import { getAnalyticsForResults, raiseRefreshTicketAction } from "../actions";
import { toast } from "sonner";

// ─── Animations ─────────────────────────────────────────────────────────

const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
};

const stagger = {
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

// ─── Icons ─────────────────────────────────────────────────────────────

function RocketIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55l-3.2-3.2c-.74-.59-1.84-.51-2.55.2Z" />
            <path d="m15 7-9 9" />
            <path d="M9 11 6 8" />
            <path d="M11 15 8 12" />
            <path d="m13 3 8.1 1.9c.4.1.7.5.7.9l-1.1 5c-.1.4-.4.8-.8 1L11 15c-.4.2-.8.1-1.1-.2L7 11.2c-.3-.3-.4-.7-.2-1.1l3.1-8.9c.2-.4.6-.7 1-.8l5-1.1c.4-.1.8.2.9.7Z" />
        </svg>
    );
}

// ─── Info Tooltip Component ─────────────────────────────────────────────

function InfoTooltip({ title, description, align = "right" }: { title: string; description: string; align?: "left" | "right" }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-flex">
            <button
                onClick={() => setOpen(!open)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label={`Info about ${title}`}
            >
                <Info className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40 bg-black/5" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                                "fixed left-4 right-4 bottom-4 sm:absolute z-50 sm:w-72 rounded-2xl sm:rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-5 sm:p-4 sm:bottom-auto sm:top-0",
                                align === "right" ? "sm:left-8 sm:right-auto" : "sm:right-8 sm:left-auto"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h4>
                                <button onClick={() => setOpen(false)} className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    <X className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Accordion Section Component ───────────────────────────────────────────

function AccordionSection({
    title,
    icon,
    info,
    children,
    isOpen,
    onToggle,
    className,
    badge,
    showBadgeOnlyWhenClosed = true,
    activeColor,
    borderColor
}: {
    title: string;
    icon: any;
    info?: any;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
    badge?: React.ReactNode;
    showBadgeOnlyWhenClosed?: boolean;
    activeColor?: string;
    borderColor?: string;
}) {
    return (
        <motion.section {...fadeUp} className={cn("overflow-hidden", className)}>
            <div
                role="button"
                tabIndex={0}
                onClick={onToggle}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle();
                    }
                }}
                className={cn(
                    "w-full flex items-center justify-between p-7 text-left transition-all cursor-pointer outline-none rounded-[24px] border-2",
                    isOpen
                        ? `bg-slate-50/80 dark:bg-slate-800/40 ${borderColor || "border-slate-200/60 dark:border-slate-700"} shadow-sm`
                        : `bg-white dark:bg-slate-900 ${borderColor || "border-slate-200/60 dark:border-slate-800"} shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-blue-500/20 dark:hover:border-blue-400/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.01] active:scale-[0.99]`
                )}
            >
                <div className="flex items-center gap-5">
                    <div className={cn(
                        "p-3 rounded-xl transition-colors shadow-sm",
                        isOpen ? (activeColor || "bg-white dark:bg-slate-800 text-blue-500") : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/50"
                    )}>
                        {React.createElement(icon, { className: "w-5 h-5" })}
                    </div>
                    <div>
                        <h2 className="text-[13px] font-black uppercase tracking-[0.15em] text-slate-600 dark:text-slate-300">{title}</h2>
                        {badge && (!isOpen || !showBadgeOnlyWhenClosed) && <div className="mt-1.5">{badge}</div>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {info && <div onClick={(e) => e.stopPropagation()}><InfoTooltip {...info} /></div>}
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        className="p-1 rounded-lg text-slate-400"
                    >
                        <ChevronRight className="w-5 h-5 rotate-90" />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="px-6 pb-7 mt-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────

function getReliabilityConfig(level: string) {
    switch (level) {
        case "High":
            return { emoji: "🟢", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
        case "Medium":
            return { emoji: "🟡", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" };
        default:
            return { emoji: "🔴", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
    }
}

function getSubjectConfig(color: string) {
    switch (color) {
        case "green": return {
            bar: "bg-emerald-500",
            barTrack: "bg-emerald-100 dark:bg-emerald-900/30",
            text: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
            border: "border-emerald-100 dark:border-emerald-900/40",
            badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
            icon: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        };
        case "yellow": return {
            bar: "bg-amber-500",
            barTrack: "bg-amber-100 dark:bg-amber-900/30",
            text: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/20",
            border: "border-amber-100 dark:border-amber-900/40",
            badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
            icon: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
        };
        default: return {
            bar: "bg-red-500",
            barTrack: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/20",
            border: "border-red-100 dark:border-red-900/40",
            badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
            icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
        };
    }
}

function getSubjectIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes("bio")) return "🧬";
    if (n.includes("phy")) return "⚡";
    if (n.includes("chem")) return "⚗️";
    return "📚";
}

function CircularProgress({ value, size = 120, strokeWidth = 10, color = "stroke-blue-500", trackColor = "stroke-slate-100 dark:stroke-slate-800" }: {
    value: number; size?: number; strokeWidth?: number; color?: string; trackColor?: string;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2} cy={size / 2} r={radius}
                className={trackColor}
                strokeWidth={strokeWidth} fill="none"
            />
            <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                className={color}
                strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                strokeLinecap="round"
            />
        </svg>
    );
}

// ─── Info Descriptions ──────────────────────────────────────────────────

const INFO_TEXTS = {
    levelEstimate: {
        title: "NEET Level Estimate",
        description: "An estimated score range based on your performance, adjusted for guessing. Lower confidence leads to a wider range."
    },
    confidence: {
        title: "Confidence Level",
        description: "Shows how reliable your analysis is based on attempts, time spent, and answer patterns. Higher confidence means more trustworthy results."
    },
    effortScore: {
        title: "Effort Score",
        description: "Measures how seriously you attempted the test. Components: Questions Attempted (40%), Active Time (25% — only time between real actions, ignoring idle gaps >60s), Interaction Depth (20% — option selects, changes, navigation), and Completion Behavior (15% — penalizes same-option spam, ultra-fast clicking, and last-minute rushing). A score below 20 is flagged as an invalid attempt."
    },
    subjectBreakdown: {
        title: "Subject Breakdown",
        description: "Shows your accuracy per subject with guessing correction applied. 'Level' indicates your relative standing: Strong (≥55% adjusted), Moderate (35–55%), Weak (15–35%), Critical (<15%). The accuracy shown is based on questions you actually attempted."
    },
    weakAreas: {
        title: "Opportunity Areas",
        description: "Focusing on these areas with NEETStand's 30-Day Sprint can jumpstart your score by 80–120 marks with targeted, high-yield practice."
    },
    whatIf: {
        title: "What-If Simulation",
        description: "Shows how your estimated level changes if you answered a few more questions correctly. This demonstrates the impact of targeted preparation and helps you visualize your potential."
    },
};

// ─── Main Component ─────────────────────────────────────────────────────

export function DiagnosticResultsClient({ analytics }: { analytics: DiagnosticAnalytics }) {
    const { overall, levelEstimate, reliability, effort, subjects, weakAreas, conditionalUX, whatIf } = analytics;
    const reliabilityConf = getReliabilityConfig(reliability.level);

    const [expandedSection, setExpandedSection] = useState<string | null>("level");
    const [isRaisingTicket, setIsRaisingTicket] = useState(false);

    const handleRaiseTicket = async () => {
        if (!analytics.attemptId) return;
        setIsRaisingTicket(true);
        try {
            const result = await raiseRefreshTicketAction(analytics.attemptId);
            if (result.success) {
                toast.success("Ticket raised successfully! Our team will review your request.");
            } else {
                toast.error(result.error || "Failed to raise ticket.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsRaisingTicket(false);
        }
    };


    const showRetake = reliability.level === "Low" || effort.score < 60;
    const effortColor = effort.score >= 80
        ? "stroke-emerald-500"
        : effort.score >= 50
            ? "stroke-amber-500"
            : effort.score >= 20
                ? "stroke-orange-500"
                : "stroke-red-500";

    return (
        <div className="w-full max-w-[680px] mx-auto pb-24 px-4 sm:px-6">
            <motion.div {...stagger} initial="initial" animate="animate" className="space-y-10">

                {/* ─── 1. HERO: Level Estimate ─── */}
                <motion.section {...fadeUp} className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-2xl shadow-slate-900/30">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/8 to-cyan-500/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-60" />

                    <div className="relative z-10 p-7 sm:p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                                    <Target className="w-4 h-4 text-blue-300" />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Your NEET Level</span>
                            </div>
                            <InfoTooltip {...INFO_TEXTS.levelEstimate} align="left" />
                        </div>

                        <div className="mb-6">
                            <h1 className="text-[52px] sm:text-[60px] font-black tracking-tight leading-none bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
                                {levelEstimate.min} – {levelEstimate.max}
                            </h1>
                            <p className="text-slate-400 mt-2.5 text-sm flex items-center gap-2">
                                Based on your diagnostic
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 text-[11px] font-bold tracking-wide text-slate-300">
                                    {levelEstimate.label}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={cn("inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[11px] font-bold backdrop-blur-sm", reliabilityConf.bg)}>
                                <span className="text-xs">{reliabilityConf.emoji}</span>
                                <span className={cn("uppercase tracking-wider", reliabilityConf.color)}>Confidence: {reliability.level}</span>
                            </div>
                            <div className="-mt-1">
                                <InfoTooltip {...INFO_TEXTS.confidence} />
                            </div>
                        </div>

                        <div className="mt-5 p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                            <p className="text-[13px] font-semibold text-white/90 mb-0.5">{conditionalUX.headline}</p>
                            <p className="text-[13px] text-slate-400/90 leading-relaxed">{conditionalUX.message}</p>
                        </div>
                    </div>
                </motion.section>

                {/* ─── Quick Stats Row ─── */}
                <motion.section {...fadeUp} className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 p-5 text-center transition-all hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-sm">
                        <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">{overall.attempted}<span className="text-sm font-bold text-slate-400 ml-1">/{overall.totalQuestions}</span></p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-2.5">Attempted</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 p-5 text-center transition-all hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-sm">
                        <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">{overall.correct}<span className="text-sm font-bold text-slate-400 ml-1">/{overall.attempted}</span></p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-2.5">Correct</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/50 p-5 text-center transition-all hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-sm">
                        <p className="text-3xl font-black text-slate-800 dark:text-white leading-none">{overall.accuracy}<span className="text-sm font-bold text-slate-400 ml-0.5">%</span></p>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mt-2.5">Accuracy</p>
                    </div>
                </motion.section>

                {/* ─── 2. EFFORT SCORE (Accordion) ─── */}
                <AccordionSection
                    title="Effort Score"
                    icon={Zap}
                    info={INFO_TEXTS.effortScore}
                    activeColor="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                    borderColor="border-amber-200 dark:border-amber-500/30"
                    isOpen={expandedSection === "effort"}
                    onToggle={() => setExpandedSection(expandedSection === "effort" ? null : "effort")}
                    badge={
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold mt-1",
                            effort.score >= 80 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                effort.score >= 50 ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                    effort.score >= 20 ? "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                                        "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                            <Flame className="w-2.5 h-2.5" />
                            {effort.label} • {effort.score}/100
                        </div>
                    }
                >
                    <div className="flex items-center gap-6">
                        <div className="relative shrink-0">
                            <CircularProgress value={effort.score} size={80} strokeWidth={8} color={effortColor} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{effort.score}</span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">/ 100</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{effort.insight}</p>
                        </div>
                    </div>

                    {effort.breakdown && (
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-3">Score Breakdown</p>
                            <div className="space-y-2.5">
                                {[
                                    { label: "Attempt Rate", value: effort.breakdown.attemptScore, max: 40, color: "bg-blue-500" },
                                    { label: "Time Engagement", value: effort.breakdown.timeScore, max: 25, color: "bg-cyan-500" },
                                    { label: "Answer Interactions", value: effort.breakdown.interactionScore, max: 20, color: "bg-violet-500" },
                                    { label: "Answer Quality", value: effort.breakdown.completionScore, max: 15, color: "bg-amber-500" },
                                ].map(item => {
                                    const pct = item.max > 0 ? Math.round((item.value / item.max) * 100) : 0;
                                    return (
                                        <div key={item.label}>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</span>
                                                <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 tabular-nums">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={cn("h-full rounded-full", item.color)}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {effort.activeTimeSeconds > 0 && (
                                <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-4">
                                    Active time: {Math.floor(effort.activeTimeSeconds / 60)}m {effort.activeTimeSeconds % 60}s
                                    {!effort.isEngaged && " • Not engaged"}
                                </p>
                            )}

                            {effort.score < 20 && (
                                <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 shadow-sm">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0">
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-bold text-amber-900 dark:text-amber-200 uppercase tracking-tight">Low Effort Detected</h4>
                                            <p className="text-[14px] text-amber-800/70 dark:text-amber-400/70 mt-1 leading-relaxed">
                                                Your effort score is very low, which may lead to inaccurate results. If you wish to retake the test, please raise a request below.
                                            </p>
                                            <button
                                                onClick={handleRaiseTicket}
                                                disabled={isRaisingTicket}
                                                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
                                            >
                                                {isRaisingTicket ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Zap className="w-3.5 h-3.5" />
                                                )}
                                                Raise Ticket for Retake
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </AccordionSection>

                {/* ─── 3. SUBJECT ANALYSIS (Accordion) ─── */}
                <AccordionSection
                    title="Subject Analysis"
                    icon={BarChart3}
                    info={INFO_TEXTS.subjectBreakdown}
                    activeColor="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                    borderColor="border-indigo-200 dark:border-indigo-500/30"
                    isOpen={expandedSection === "subjects" || !!expandedSection?.startsWith("sub_")}
                    onToggle={() => setExpandedSection(expandedSection === "subjects" || expandedSection?.startsWith("sub_") ? null : "subjects")}
                    badge={
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {subjects.map(s => (
                                <div key={s.name} className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                        {s.name.substring(0, 3)}
                                    </span>
                                    <span className={cn(
                                        "text-[11px] font-bold",
                                        s.color === "green" ? "text-emerald-600 dark:text-emerald-400" :
                                            s.color === "yellow" ? "text-amber-600 dark:text-amber-400" :
                                                "text-red-500"
                                    )}>
                                        {s.accuracy}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    }
                >
                    <div className="space-y-3">
                        {subjects.map((s) => {
                            const sc = getSubjectConfig(s.color);
                            return (
                                <div key={s.name} className={cn("rounded-[20px] border p-5 bg-slate-50/50 dark:bg-slate-800/10", sc.border)}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm", sc.icon)}>
                                                {getSubjectIcon(s.name)}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight">{s.name}</p>
                                                <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">{s.correct}/{s.total} correct • {s.attemptPct}% attempted</p>
                                            </div>
                                        </div>
                                        <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg", sc.badge)}>
                                            {s.level}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[13px]">
                                            <span className="text-slate-400 dark:text-slate-500 font-medium tracking-tight">Adjusted Accuracy</span>
                                            <span className={cn("font-bold text-base", sc.text)}>{s.accuracy}%</span>
                                        </div>
                                        <div className="h-2.5 bg-slate-200/50 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.max(2, s.accuracy)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={cn("h-full rounded-full", sc.bar)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AccordionSection>

                {/* ─── 4. WEAK AREAS (Accordion) ─── */}
                <AccordionSection
                    title="Biggest Opportunity Areas"
                    icon={Brain}
                    info={INFO_TEXTS.weakAreas}
                    activeColor="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                    borderColor="border-emerald-200 dark:border-emerald-500/30"
                    isOpen={expandedSection === "weak" || !!expandedSection?.startsWith("opp_")}
                    onToggle={() => setExpandedSection(expandedSection === "weak" || !!expandedSection?.startsWith("opp_") ? null : "weak")}
                >
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        Focus on these high-yield chapters (top 5 per subject) where you have the most room for growth.
                    </p>
                    <div className="space-y-4">
                        {subjects.map((s) => {
                            const sc = getSubjectConfig(s.color);
                            const isSubOpen = expandedSection === `opp_${s.name}`;
                            const toggleSub = (e: React.MouseEvent) => {
                                e.stopPropagation();
                                setExpandedSection(isSubOpen ? 'weak' : `opp_${s.name}`);
                            };

                            return (
                                <div key={s.name} className={cn(
                                    "overflow-hidden rounded-[20px] transition-all border",
                                    isSubOpen
                                        ? "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 shadow-md"
                                        : "border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10"
                                )}>
                                    <div
                                        role="button"
                                        onClick={toggleSub}
                                        className="p-5 cursor-pointer hover:bg-white dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-sm", sc.icon)}>
                                                {getSubjectIcon(s.name)}
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-slate-800 dark:text-white uppercase tracking-tight">{s.name}</p>
                                                <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">Top 5 Important Chapters</p>
                                            </div>
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isSubOpen && "rotate-180")} />
                                    </div>

                                    <AnimatePresence>
                                        {isSubOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                            >
                                                <div className="px-5 pb-6 pt-1 border-t border-slate-50 dark:border-slate-800/50">
                                                    <div className="mt-4 grid grid-cols-1 gap-2.5">
                                                        {(s.topChapters || []).map((ch, idx) => (
                                                            <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100/50 dark:border-slate-800/30 transition-all hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-sm">
                                                                <span className="text-[11px] font-black text-slate-300 dark:text-slate-600 w-4">{idx + 1}</span>
                                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{ch.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30 shadow-sm shadow-emerald-500/5">
                        <p className="text-[15px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            Boost your score with NEETStand
                        </p>
                        <p className="text-[14px] text-emerald-700/80 dark:text-emerald-400/80 mt-2 leading-relaxed">
                            Focusing on these 15 high-weightage chapters can realistically gain you <span className="font-black text-emerald-900 dark:text-emerald-100 px-1">80–120 marks</span> in under 30 days.
                        </p>
                        <Link href="/onboarding/analysis/strength" className="mt-5 inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-emerald-600 text-white text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0">
                            Continue Planning
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </AccordionSection>

                {/* ─── 5. SCORE POTENTIAL (Accordion) ─── */}
                <AccordionSection
                    title="Score Potential"
                    icon={TrendingUp}
                    info={INFO_TEXTS.whatIf}
                    activeColor="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    borderColor="border-blue-200 dark:border-blue-500/30"
                    isOpen={expandedSection === "potential"}
                    onToggle={() => setExpandedSection(expandedSection === "potential" ? null : "potential")}
                >
                    <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
                                <RocketIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-bold text-slate-800 dark:text-white">What if you improved slightly?</h3>
                                <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                    If you answered just <span className="font-bold text-blue-600 dark:text-blue-400">{whatIf.additionalCorrect} more questions</span> correctly, your estimate would jump to:
                                </p>
                                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10">
                                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{whatIf.newLevelEstimate.min} – {whatIf.newLevelEstimate.max}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Potential Level</span>
                                        <span className="text-base font-bold text-slate-700 dark:text-slate-200">{whatIf.newLevelEstimate.label}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionSection>



                {/* ─── 7. FINAL CTA ─── */}
                <motion.section {...fadeUp} className="relative overflow-hidden rounded-[25px] bg-slate-950 text-white p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')] opacity-50" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
                            <Shield className="w-3 h-3" /> Step Two Complete
                        </div>
                        <h3 className="text-2xl font-black mb-3">Diagnostic Analysis Locked!</h3>
                        <p className="text-slate-400 text-sm mb-8 max-w-sm leading-relaxed">
                            You've completed the vital first step. Now, let's build your personalized path to a higher NEET score.
                        </p>
                        <Link
                            href="/onboarding/analysis/strength"
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/20"
                        >
                            Continue Planning
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.section>

            </motion.div>
        </div>
    );
}

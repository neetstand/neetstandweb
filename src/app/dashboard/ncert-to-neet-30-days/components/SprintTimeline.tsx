"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import {
    CheckCircle2, Play, Trophy, ChevronDown, Clock, BookOpen,
    Gauge, Zap, Target, Brain, BarChart3, Shield, AlertTriangle
} from "lucide-react";
import { getPriorityConfig, subjectIconMap, subjectColors } from "./SharedConfig";
import { AssessmentModal } from "./AssessmentModal";

// ─── Formatting Helpers ─────────────────────────────
function formatMinutes(minutes: number): string {
    if (!minutes || isNaN(minutes)) return "0 min";
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

// ─── Probability Badge ──────────────────────────────
function ProbBadge({ prob }: { prob: "high" | "medium" | "low" }) {
    const config = {
        high: { label: "High Prob.", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
        medium: { label: "Medium", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
        low: { label: "Low Prob.", cls: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400" },
    };
    const c = config[prob];
    return (
        <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", c.cls)}>
            {c.label}
        </span>
    );
}

// ─── Complexity Dots ──────────────────────────────
function ComplexityDots({ level }: { level: number }) {
    return (
        <div className="flex items-center gap-0.5" title={`Complexity: ${level}/5`}>
            {[1, 2, 3, 4, 5].map(i => (
                <div
                    key={i}
                    className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors",
                        i <= level
                            ? "bg-sky-500 dark:bg-sky-400"
                            : "bg-gray-200 dark:bg-slate-700"
                    )}
                />
            ))}
        </div>
    );
}

// ─── Subject Topic Card ──────────────────────────────
function SubjectTopicCard({
    topic,
    subjectKey,
    onClick,
}: {
    topic: any;
    subjectKey: "physics" | "chemistry" | "biology";
    onClick: () => void;
}) {
    const colors = subjectColors[subjectKey];
    const Icon = subjectIconMap[subjectKey];

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "group w-full rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer",
                "bg-white dark:bg-slate-900/60",
                "border-gray-100 dark:border-slate-800",
                "hover:border-gray-200 dark:hover:border-slate-700",
                "hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50",
            )}
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={cn(
                        "p-2 rounded-lg bg-gradient-to-br text-white shadow-sm",
                        colors.gradient
                    )}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <div>
                        <span className={cn("text-xs font-semibold uppercase tracking-wide", colors.text)}>
                            {subjectKey}
                        </span>
                        {topic.probability && <ProbBadge prob={topic.probability} />}
                    </div>
                </div>
            </div>

            <h4 className="font-semibold text-sm text-gray-900 dark:text-slate-100 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {topic.label}
            </h4>
            {topic.annotation && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mb-2">
                    {topic.annotation}
                </p>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 dark:border-slate-800/60">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    {formatMinutes(topic.estimatedMinutes || 60)}
                </div>
                <ComplexityDots level={topic.complexity || 3} />
            </div>
        </motion.button>
    );
}

// ─── Assessment Card ──────────────────────────────
function AssessmentCard({
    assessment,
    isCompleted,
    onClick,
}: {
    assessment: any;
    isCompleted: boolean;
    onClick: () => void;
}) {
    if (!assessment) return null;
    const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
        diagnostic: { icon: Gauge, color: "text-sky-600 dark:text-sky-400" },
        flash: { icon: Zap, color: "text-amber-600 dark:text-amber-400" },
        "power-quiz": { icon: Target, color: "text-orange-600 dark:text-orange-400" },
        "memory-snap": { icon: Brain, color: "text-violet-600 dark:text-violet-400" },
        "mini-mock": { icon: BarChart3, color: "text-blue-600 dark:text-blue-400" },
        "full-mock": { icon: Shield, color: "text-red-600 dark:text-red-400" },
        "error-log": { icon: AlertTriangle, color: "text-rose-600 dark:text-rose-400" },
    };
    const cfg = typeConfig[assessment.type] || { icon: BookOpen, color: "text-gray-600" };
    const Icon = cfg.icon;

    if (isCompleted) {
        return (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                        {assessment.label}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-500 mt-0.5 font-medium">Completed ✓</p>
                </div>
                <button
                    onClick={onClick}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors shrink-0"
                >
                    Review
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
        >
            <div className={cn("p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm group-hover:scale-105 transition-transform", cfg.color)}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                    {assessment.label}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatMinutes(assessment.duration)}
                    </span>
                    {assessment.questionCount > 0 && (
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {assessment.questionCount} Qs
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Day Card ──────────────────────────────
function DayCard({
    sprintDay,
    isCurrentDay,
    isCompleted,
    isExpanded,
    onToggle,
    onTopicClick,
    onAssessmentClick,
    subjectFocus,
    completedAssessmentKeys,
}: {
    sprintDay: any;
    isCurrentDay: boolean;
    isCompleted: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onTopicClick: (subjectId: string, topicId: string, dayNum: number, actualSubject: string, endOrder?: number) => void;
    onAssessmentClick: (assessment: any, dayNum: number) => void;
    subjectFocus?: "physics" | "chemistry" | "biology";
    completedAssessmentKeys: Set<string>;
}) {
    const pConfig = getPriorityConfig(sprintDay.priority);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "relative rounded-2xl border overflow-hidden transition-all duration-300",
                isCurrentDay
                    ? "border-sky-400 dark:border-sky-500/50 shadow-lg shadow-sky-500/10 dark:shadow-sky-500/5 ring-1 ring-sky-400/30"
                    : isCompleted
                        ? "border-emerald-200 dark:border-emerald-500/20 opacity-80"
                        : sprintDay.isConsolidation
                            ? "border-emerald-200 dark:border-emerald-500/20"
                            : sprintDay.isMilestone
                                ? "border-amber-200 dark:border-amber-500/20"
                                : "border-gray-100 dark:border-slate-800",
                "bg-white dark:bg-slate-900/60",
            )}
        >
            {isCurrentDay && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
            )}

            <button
                onClick={onToggle}
                className="w-full p-4 sm:p-5 text-left"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold transition-colors",
                        isCurrentDay
                            ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20"
                            : isCompleted
                                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : sprintDay.isConsolidation
                                    ? "bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    )}>
                        <span className="text-[9px] uppercase tracking-wider font-medium opacity-70">Day</span>
                        <span className="text-lg sm:text-xl leading-none">{sprintDay.day}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-base">{pConfig?.icon}</span>
                            <h3 className={cn(
                                "font-bold text-sm sm:text-base truncate",
                                isCurrentDay ? "text-sky-700 dark:text-sky-300" : "text-gray-900 dark:text-slate-100"
                            )}>
                                {sprintDay.title || sprintDay.priorityLabel}
                            </h3>
                            {isCompleted && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                            {sprintDay.isMilestone && !isCompleted && (
                                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                    <Trophy className="w-2.5 h-2.5" />
                                    MILESTONE
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 italic truncate">
                            "{sprintDay.tagline}"
                        </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        {(["physics", "chemistry", "biology"] as const)
                            .filter(s => !subjectFocus || s === subjectFocus)
                            .map(s => {
                                const Icon = subjectIconMap[s];
                                return (
                                    <div key={s} className={cn(
                                        "p-1.5 rounded-lg",
                                        subjectColors[s].bg,
                                    )}>
                                        <Icon className={cn("w-3.5 h-3.5", subjectColors[s].text)} />
                                    </div>
                                );
                            })}
                    </div>

                    <ChevronDown className={cn(
                        "w-5 h-5 text-gray-400 dark:text-slate-500 transition-transform duration-300 shrink-0",
                        isExpanded && "rotate-180"
                    )} />
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 sm:px-5 pb-5 space-y-4">
                            <div className="h-px bg-gray-100 dark:bg-slate-800" />
                            <div className={cn("grid gap-3", subjectFocus ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3")}>
                                {(!subjectFocus || subjectFocus === "physics") && sprintDay.physics && (
                                    <SubjectTopicCard
                                        topic={sprintDay.physics}
                                        subjectKey="physics"
                                        onClick={() => onTopicClick(sprintDay.physics.subjectId, sprintDay.physics.topicId, sprintDay.day, "physics", sprintDay.physics.endOrder)}
                                    />
                                )}
                                {(!subjectFocus || subjectFocus === "chemistry") && sprintDay.chemistry && (
                                    <SubjectTopicCard
                                        topic={sprintDay.chemistry}
                                        subjectKey="chemistry"
                                        onClick={() => onTopicClick(sprintDay.chemistry.subjectId, sprintDay.chemistry.topicId, sprintDay.day, "chemistry", sprintDay.chemistry.endOrder)}
                                    />
                                )}
                                {(!subjectFocus || subjectFocus === "biology") && sprintDay.biology && (
                                    <SubjectTopicCard
                                        topic={sprintDay.biology}
                                        subjectKey="biology"
                                        onClick={() => onTopicClick(sprintDay.biology.subjectId, sprintDay.biology.topicId, sprintDay.day, "biology", sprintDay.biology.endOrder)}
                                    />
                                )}
                            </div>
                            {sprintDay.assessment && (() => {
                                // Derive subject-specific assessment label when a plan focus is active
                                const subjectLabel = subjectFocus
                                    ? subjectFocus.charAt(0).toUpperCase() + subjectFocus.slice(1)
                                    : null;
                                const assessment = subjectLabel
                                    ? {
                                        ...sprintDay.assessment,
                                        label: sprintDay.assessment.label
                                            // Insert subject before last word: "10 Day Flash" → "10 Day Physics Flash"
                                            .replace(/(\s)(\S+)$/, ` ${subjectLabel} $2`),
                                    }
                                    : sprintDay.assessment;

                                return (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                            Daily Assessment
                                        </h4>
                                        <AssessmentCard
                                            assessment={assessment}
                                            isCompleted={completedAssessmentKeys.has(`${sprintDay.day}-${sprintDay.assessment?.type}`)}
                                            onClick={() => onAssessmentClick(sprintDay.assessment, sprintDay.day)}
                                        />
                                    </div>
                                );
                            })()}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Timeline Component ──────────────────────────────
export function SprintTimeline({
    userId,
    allSprintDays,
    mergedSprintDays,
    completedDaySet,
    currentDay,
    activatedSubjects,
    subjectFocus,
    onRequiresPro
}: {
    allSprintDays: any[];
    mergedSprintDays: any[];
    completedDaySet: Set<number>;
    currentDay: number;
    activatedSubjects: string[] | null;
    subjectFocus?: "physics" | "chemistry" | "biology";
    onRequiresPro?: () => void;
    userId?: string;
}) {
    const router = useRouter();
    const [expandedDay, setExpandedDay] = useState<number | null>(currentDay);
    const [selectedAssessment, setSelectedAssessment] = useState<{ assessment: any; dayNum: number } | null>(null);

    // ─── Completed Assessment Tracking (persisted to localStorage) ───
    const STORAGE_KEY = userId ? `neetstand_completed_assessments_${userId}` : "neetstand_completed_assessments";
    const [completedAssessments, setCompletedAssessments] = useState<Set<string>>(() => {
        if (typeof window === "undefined") return new Set();
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch { return new Set(); }
    });

    const markAssessmentComplete = (key: string) => {
        setCompletedAssessments(prev => {
            const next = new Set(prev);
            next.add(key);
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...next])); } catch { }
            return next;
        });
    };

    const getAssessmentKey = (dayNum: number, type: string) => `${dayNum}-${type}`;

    const handleTopicClick = (subjectId: string, topicId: string, dayNum: number, actualSubject: string, endOrder?: number) => {
        let url = `/learn/${subjectId}/${topicId}`;
        if (endOrder) url += `?end=${endOrder}`;
        router.push(url);
    };

    const handleAssessmentClick = (assessment: any, dayNum: number) => {
        setSelectedAssessment({ assessment, dayNum });
    };

    return (
        <div className="space-y-3">
            <AssessmentModal
                isOpen={!!selectedAssessment}
                onClose={() => setSelectedAssessment(null)}
                assessment={selectedAssessment?.assessment}
                currentDayNumber={currentDay}
                completedDaySet={completedDaySet}
                allSprintDays={allSprintDays}
                subjectFocus={subjectFocus}
                isReview={selectedAssessment ? completedAssessments.has(getAssessmentKey(selectedAssessment.dayNum, selectedAssessment.assessment?.type)) : false}
                onComplete={() => {
                    if (selectedAssessment) {
                        markAssessmentComplete(getAssessmentKey(selectedAssessment.dayNum, selectedAssessment.assessment?.type));
                    }
                }}
            />
            {mergedSprintDays.map((day: any) => (
                <DayCard
                    key={day.day}
                    sprintDay={day}
                    isCurrentDay={day.day === currentDay}
                    isCompleted={completedDaySet.has(day.day)}
                    isExpanded={expandedDay === day.day}
                    onToggle={() => {
                        setExpandedDay(prev => prev === day.day ? null : day.day);
                    }}
                    onTopicClick={handleTopicClick}
                    onAssessmentClick={handleAssessmentClick}
                    subjectFocus={subjectFocus}
                    completedAssessmentKeys={completedAssessments}
                />
            ))}
        </div>
    );
}

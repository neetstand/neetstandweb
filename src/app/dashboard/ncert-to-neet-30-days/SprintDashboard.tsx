"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
    SPRINT_DAYS,
    type DayTopic,
} from "@/lib/constants/sprint-data";
import { PLAN_30_DAY_DETAILS } from "@/lib/30dayplanDaydetails";
import {
    Calendar, Clock, Flame, ArrowRight,
    BookOpen, Star, Sparkles, TrendingUp, CheckCircle2, BarChart3
} from "lucide-react";
import { cn } from "@/utils/cn";

// Import our new Client Components
import { PlanSelector } from "./components/PlanSelector";
import { ProgressRing } from "./components/ProgressRing";
import { SprintTimeline } from "./components/SprintTimeline";
import { AnalyticsModal } from "./components/AnalyticsModal";
import { ProgressModal } from "./components/ProgressModal";
import { subjectIconMap, subjectColors } from "./components/SharedConfig";

// ─── Week definitions ─────────────────────────────────────────────────────────
const WEEKS = [
    { num: 1, label: "Foundation & Direct Marks", range: "DAYS 1 - 5", phase: "Ultra High Historical Weightage" },
    { num: 2, label: "High-Yield Push", range: "DAYS 6 - 10", phase: "Very High Weightage" },
    { num: 3, label: "Deep Dive", range: "DAYS 11 - 15", phase: "High to Upper Medium Weightage" },
    { num: 4, label: "Advanced Integration", range: "DAYS 16 - 20", phase: "Medium Weightage" },
    { num: 5, label: "Finish & Revise", range: "DAYS 21 - 25", phase: "Lower Medium Weightage" },
    { num: 6, label: "Final Mock & Confidence Lock", range: "DAYS 26 - 30", phase: "Low Weightage" },
];

function WeekHeader({
    label,
    daysRange,
    phase,
    completedCount,
    totalDays,
}: {
    label: string;
    daysRange: string;
    phase: string;
    completedCount: number;
    totalDays: number;
}) {
    const progress = totalDays > 0 ? (completedCount / totalDays) * 100 : 0;

    return (
        <div className="flex items-center gap-4 mb-4 mt-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">
                        {daysRange} <span className="text-base text-gray-500 font-normal normal-case">({phase})</span>
                    </span>
                </div>
                <span className="text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-full truncate">
                    {label}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-sky-500 dark:bg-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-mono">
                    {completedCount}/{totalDays}
                </span>
            </div>
        </div>
    );
}

function StatsRow({ completedDays, currentDay, onOpenAnalytics, onOpenProgress }: { completedDays: number; currentDay: number; onOpenAnalytics: () => void; onOpenProgress: () => void }) {
    const totalDays = 30;
    const daysLeft = Math.max(0, totalDays - currentDay + 1);
    const overallProgress = (completedDays / totalDays) * 100;

    const stats: any[] = [
        {
            label: "Topicwise", value: "Strategy", sub: "", icon: TrendingUp, color: "text-blue-600 dark:text-blue-400",
            onClick: onOpenProgress,
            use3D: true, doorBg: "bg-blue-50 dark:bg-blue-900/20",
            className: "cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group"
        },
        {
            label: "Performance", value: "Analytics", sub: "", icon: BarChart3, color: "text-purple-600 dark:text-purple-400",
            onClick: onOpenAnalytics,
            use3D: true, doorBg: "bg-purple-50 dark:bg-purple-900/20",
            className: "cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-300 group"
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {stats.map(stat => {
                const Icon = stat.icon;
                if (stat.use3D) {
                    return (
                        <div
                            key={stat.label}
                            onClick={stat.onClick}
                            className={cn(
                                "rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 relative group",
                                stat.onClick ? "cursor-pointer" : "",
                                "perspective-[1000px] hover:shadow-lg transition-all duration-300"
                            )}
                        >
                            {/* Inside Window Background (Icon reveals behind the door) */}
                            <div className={cn("absolute inset-0 rounded-xl flex items-center justify-start pl-4 overflow-hidden", stat.doorBg)}>
                                <Icon className={cn("w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 drop-shadow-sm", stat.color)} />
                            </div>

                            {/* The Fore-Window (The door that opens outwards from the left corner) */}
                            <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl p-4 origin-right transition-transform duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:[transform:rotateY(-30deg)] border border-transparent shadow-sm z-10 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className={cn("w-4 h-4 transition-colors", stat.color)} />
                                    <span className="text-xs text-gray-400 dark:text-slate-500">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                                    <span className="text-xs text-gray-400 dark:text-slate-500">{stat.sub}</span>
                                </div>
                            </div>

                            {/* Spacer to keep box dimensions intact */}
                            <div className="invisible pointer-events-none">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="text-xs">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className="text-xs">{stat.sub}</span>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={stat.label}
                        onClick={stat.onClick}
                        className={cn(
                            "rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 relative overflow-hidden",
                            stat.className
                        )}
                    >
                        {stat.onClick && (
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}
                        <div className="flex items-center gap-2 mb-2 relative z-10">
                            <Icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", stat.color)} />
                            <span className="text-xs text-gray-400 dark:text-slate-500">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                            <span className="text-xs text-gray-400 dark:text-slate-500">{stat.sub}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main Sprint Dashboard (Server Component) ──────────────────────────────
export default function SprintDashboard({
    userId,
    userName,
    availablePlans,
    activePlanId,
    activePlan,
    hasActivated = false,
    activatedSubjects = null,
    subjectFocus,
    activeProductString,
    plansData = [],
    onOpenCheckout,
}: {
    userName?: string;
    availablePlans: any[];
    activePlanId: string | null;
    activePlan: any;
    hasActivated?: boolean;
    activatedSubjects?: string[] | null;
    subjectFocus?: "physics" | "chemistry" | "biology";
    activeProductString?: string | null;
    plansData?: any[];
    onOpenCheckout?: () => void;
    userId?: string;
}) {
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    useEffect(() => {
        const blocked = searchParams.get("blocked");
        if (blocked) {
            const subjectName = blocked.charAt(0).toUpperCase() + blocked.slice(1);
            toast.error(`Access Denied`, {
                description: `Your current plan does not include ${subjectName}. Upgrade to the full 30 Day Sprint Plan to unlock all subjects.`,
                duration: 6000,
            });
            // Strip the query param from the URL without a page reload
            const url = new URL(window.location.href);
            url.searchParams.delete("blocked");
            router.replace(url.pathname, { scroll: false });
        }
    }, [searchParams]);

    // Simulated state — in production this comes from the DB profile
    const currentDay = 1;
    const completedDays = 0;
    const completedDaySet = new Set<number>();

    const slugify = (text: string) => {
        if (!text) return "";
        return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    // Calculate merged static + DB data
    const mergedSprintDays = (!activePlan?.days || activePlan.days.length === 0)
        ? SPRINT_DAYS
        : SPRINT_DAYS.map(staticDay => {
            const dbDay = activePlan.days.find((d: any) => d.day_number === staticDay.day);
            if (!dbDay) return staticDay;

            // Helper to build DayTopic safely
            const buildTopic = (subjMap: any, chapterData: any, staticTopic: DayTopic, startOrder: number, endOrder: number): DayTopic => {
                if (!subjMap || !chapterData) return staticTopic;
                let complexity = staticTopic.complexity;
                if (chapterData.toughness === "Hard") complexity = 5;
                if (chapterData.toughness === "Moderate") complexity = 3;
                if (chapterData.toughness === "Easy") complexity = 2;

                // Calculate time based on 15 minutes per section covered today
                const calculatedMinutes = ((endOrder || 5) - (startOrder || 1) + 1) * 15;

                return {
                    ...staticTopic,
                    // Route directly via URL parameters
                    subjectId: slugify(chapterData.chapter_name) || staticTopic.subjectId,
                    topicId: String(Math.max(1, startOrder || 1)),
                    endOrder: endOrder,
                    label: chapterData.chapter_name,
                    complexity,
                    estimatedMinutes: calculatedMinutes > 0 ? calculatedMinutes : 60,
                };
            };

            const physics = buildTopic(dbDay.physics_chapter_code, dbDay.physicsChapter, staticDay.physics, dbDay.physics_start_order, dbDay.physics_end_order);
            const chemistry = buildTopic(dbDay.chemistry_chapter_code, dbDay.chemistryChapter, staticDay.chemistry, dbDay.chemistry_start_order, dbDay.chemistry_end_order);
            const biology = buildTopic(dbDay.biology_chapter_code, dbDay.biologyChapter, staticDay.biology, dbDay.biology_start_order, dbDay.biology_end_order);

            // Refine annotation correctly based on the exact subject
            if (dbDay.physicsChapter) {
                physics.annotation = `Parts ${dbDay.physics_start_order || 1}-${dbDay.physics_end_order || 5}`;
            }
            if (dbDay.chemistryChapter) {
                chemistry.annotation = `Parts ${dbDay.chemistry_start_order || 1}-${dbDay.chemistry_end_order || 5}`;
            }
            if (dbDay.biologyChapter) {
                biology.annotation = `Parts ${dbDay.biology_start_order || 1}-${dbDay.biology_end_order || 5}`;
            }

            const details = PLAN_30_DAY_DETAILS.find((d) => d.day === staticDay.day);

            return {
                ...staticDay,
                title: details?.title || staticDay.priorityLabel,
                tagline: details?.tagline || staticDay.tagline,
                physics,
                chemistry,
                biology
            };
        });

    // Extract chapters for the Analytics Drill-Down by subject
    const chaptersBySubject: Record<string, { code: string; name: string }[]> = {
        physics: [],
        chemistry: [],
        biology: []
    };

    activePlan?.days?.forEach((d: any) => {
        if (d.physicsChapter) chaptersBySubject.physics.push({ code: d.physics_chapter_code, name: d.physicsChapter.chapter_name });
        if (d.chemistryChapter) chaptersBySubject.chemistry.push({ code: d.chemistry_chapter_code, name: d.chemistryChapter.chapter_name });
        if (d.biologyChapter) chaptersBySubject.biology.push({ code: d.biology_chapter_code, name: d.biologyChapter.chapter_name });
    });

    // Remove duplicates
    const uniqueChaptersBySubject = {
        physics: Array.from(new Map(chaptersBySubject.physics.filter(c => c.code).map(item => [item.code, item])).values()),
        chemistry: Array.from(new Map(chaptersBySubject.chemistry.filter(c => c.code).map(item => [item.code, item])).values()),
        biology: Array.from(new Map(chaptersBySubject.biology.filter(c => c.code).map(item => [item.code, item])).values()),
    };

    return (
        <div className="relative min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">

            {/* ─── Hero header ──────────────────────────────────────────── */}
            <div className="relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/15 dark:bg-sky-500/5 rounded-full blur-3xl" />
                <div className="absolute top-10 right-1/3 w-72 h-72 bg-blue-300/15 dark:bg-blue-500/5 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Greeting */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-3 py-1.5 rounded-full mb-3 shadow-sm border border-sky-100 dark:border-sky-500/20">
                                    <Flame className="w-3.5 h-3.5" />
                                    {
                                        subjectFocus
                                            ? `30 Day ${subjectFocus.charAt(0).toUpperCase() + subjectFocus.slice(1)} Sprint Plan`
                                            : hasActivated
                                                ? (activePlan?.name || "30 Day Sprint Plan")
                                                : "30 Day Sprint Plan"
                                    }
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                                    {userName ? userName : "Your NEET Sprint"}
                                </h1>
                                <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base max-w-xl">
                                    {activePlan?.description || "Tactical Point Scoring — optimized for maximum marks per hour."}
                                </p>

                                <PlanSelector
                                    availablePlans={availablePlans}
                                    activePlanId={activePlanId}
                                    activeProductString={activeProductString}
                                />
                            </div>

                            {/* Overall progress ring (Client) */}
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300 group">
                                <div className="group-hover:scale-105 transition-transform duration-300">
                                    <ProgressRing completedDays={completedDays} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">Sprint Progress</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500">{completedDays} of 30 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <StatsRow
                            completedDays={completedDays}
                            currentDay={currentDay}
                            onOpenAnalytics={() => setShowAnalytics(true)}
                            onOpenProgress={() => setShowProgressModal(true)}
                        />
                    </div>
                </div>
            </div>

            {/* ─── Day-by-day timeline ──────────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 space-y-4 sm:space-y-8">
                {WEEKS.map(week => {
                    const weekDays = mergedSprintDays.filter(d => {
                        const start = (week.num - 1) * 5 + 1;
                        const end = start + 4;
                        return d.day >= start && d.day <= end;
                    });
                    const weekCompleted = weekDays.filter(d => completedDaySet.has(d.day)).length;

                    return (
                        <div key={week.num}>
                            <WeekHeader
                                label={week.label}
                                daysRange={week.range}
                                phase={week.phase}
                                completedCount={weekCompleted}
                                totalDays={weekDays.length}
                            />
                            <SprintTimeline
                                userId={userId}
                                allSprintDays={mergedSprintDays}
                                mergedSprintDays={weekDays}
                                completedDaySet={completedDaySet}
                                currentDay={currentDay}
                                activatedSubjects={activatedSubjects || null}
                                subjectFocus={subjectFocus}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ─── Bonus Section ────────────────────────────────────────── */}
            {activePlan?.bonuses && activePlan.bonuses.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
                    <div className="relative rounded-3xl border border-amber-200/50 dark:border-amber-500/20 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900/50 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />

                        <div className="p-6 sm:p-8">
                            <div className="flex items-start sm:items-center justify-between gap-4 mb-8 flex-col sm:flex-row">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        Bonus Mastery
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Extra Credit</h2>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-xl">
                                        Push your score higher with these high-reward bonus chapters. Complete them anytime outside the 30-day schedule.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/50 shadow-sm">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        0 / {activePlan.bonuses.filter((b: any) => !subjectFocus || b.subject.toLowerCase() === subjectFocus).length}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">Unlocked</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activePlan.bonuses
                                    .filter((b: any) => !subjectFocus || b.subject.toLowerCase() === subjectFocus)
                                    .map((bonus: any) => {
                                        const subjKey = bonus.subject.toLowerCase() as "physics" | "chemistry" | "biology";
                                        const Icon = subjectIconMap[subjKey] || BookOpen;
                                        const subjectColor = subjectColors[subjKey] || subjectColors.physics;

                                        const bonusTopicSlug = bonus.chapter?.chapter_name
                                            ? slugify(bonus.chapter.chapter_name)
                                            : subjKey;

                                        const targetHref = `/learn/${bonusTopicSlug}/${Math.max(1, bonus.start_order)}`;

                                        return (
                                            <Link
                                                key={bonus.id}
                                                href={targetHref}
                                                className="group relative text-left bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 overflow-hidden block cursor-pointer"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-0 group-hover:opacity-100" />

                                                <div className="flex items-center gap-3 mb-4 relative">
                                                    <div className={cn("p-2 rounded-xl shadow-sm", subjectColor.bg, subjectColor.text)}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                            {bonus.subject}
                                                        </span>
                                                        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                                                            High Reward
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors relative">
                                                    {bonus.chapter?.chapter_name || `Chapter ${bonus.chapter_code}`}
                                                </h3>

                                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-4 relative">
                                                    Parts {bonus.start_order} - {bonus.end_order}
                                                </p>

                                                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800 relative">
                                                    <span className="text-[11px] font-medium text-amber-600 flex items-center gap-1">
                                                        Start Mastery <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <AnalyticsModal
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
                completedDays={completedDays}
                chaptersBySubject={uniqueChaptersBySubject}
            />

            <ProgressModal
                isOpen={showProgressModal}
                onClose={() => setShowProgressModal(false)}
                activatedSubjects={activatedSubjects}
            />
        </div>
    );
}

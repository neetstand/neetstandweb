"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    getQuestions,
    type Question, type Video,
} from "@/lib/constants/learn-data";
import {
    ArrowLeft, Play, HelpCircle, Check, ChevronRight,
    BookOpen, Lock, Sparkles, Award, Star,
    Globe2, Languages, CircleCheck, Circle, CircleDot,
    ChevronDown, CheckCircle2, XCircle, X, Maximize2, Minimize2, Menu, ChevronLeft
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import ReactPlayer from "react-player";
import { PracticeSession } from "@/components/practice";

// ─── Difficulty badge colors ──────────────────────────────────────────────────
const diffColors = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Difficult: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ video, onClick }: { video: Video, onClick: () => void }) {
    const isHinglish = video.language === "Hinglish";
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className={cn(
                "group relative rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer",
                "bg-white dark:bg-slate-900/80 border-gray-100 dark:border-slate-800",
                "hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-700 hover:-translate-y-0.5"
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                </div>
                {/* Language badge */}
                <div className={cn(
                    "absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                    isHinglish
                        ? "bg-orange-500/80 text-white"
                        : "bg-blue-500/80 text-white"
                )}>
                    <Languages className="w-3 h-3" />
                    {video.language}
                </div>

                {/* Duration */}
                <span className="absolute bottom-3 right-3 z-10 text-[11px] font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {video.duration}
                </span>
            </div>

            {/* Title */}
            <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {video.title}
                </h4>
            </div>
        </motion.div>
    );
}

// ─── Question Practice ────────────────────────────────────────────────────────
function QuestionPractice({ questions, topicTitle, subTopicTitle, onAllAttempted }: { questions: Question[], topicTitle: string, subTopicTitle: string, onAllAttempted?: (v: boolean) => void }) {
    const [activeTab, setActiveTab] = useState<"Easy" | "Moderate" | "Difficult">("Easy");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [answered, setAnswered] = useState<Record<string, number>>({});
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        if (Object.keys(answered).length === questions.length && questions.length > 0) {
            onAllAttempted?.(true);
        }
    }, [answered, questions.length, onAllAttempted]);

    // Handle full screen shortcuts and anti-scraping
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
            }
            if (e.key === 'Tab') {
                e.preventDefault();
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('contextmenu', handleContextMenu);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    const filtered = useMemo(
        () => questions.filter(q => q.difficulty === activeTab),
        [questions, activeTab]
    );

    const current = filtered[currentIndex];

    const handleTabChange = useCallback((tab: "Easy" | "Moderate" | "Difficult") => {
        setActiveTab(tab);
        setCurrentIndex(0);
        setSelectedOption(null);
    }, []);

    const handleOptionSelect = (optIndex: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(optIndex);
        setAnswered(prev => ({ ...prev, [current.id]: optIndex }));
    };

    const handleNext = () => {
        if (currentIndex < filtered.length - 1) {
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
            const prevQ = filtered[currentIndex - 1];
            setSelectedOption(answered[prevQ.id] ?? null);
        }
    };

    if (!current) return null;

    const isCorrect = selectedOption === current.correctIndex;

    const content = (
        <div className={cn(
            "space-y-5 flex flex-col h-full",
            isFullscreen && "p-4 sm:p-6 max-w-4xl mx-auto w-full"
        )}>
            {/* Difficulty Tabs & Fullscreen */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {(["Easy", "Moderate", "Difficult"] as const).map((tab) => {
                        const count = questions.filter(q => q.difficulty === tab).length;
                        return (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap",
                                    activeTab === tab
                                        ? diffColors[tab] + " shadow-sm"
                                        : "bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800"
                                )}
                            >
                                {tab}
                                <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                            </button>
                        );
                    })}
                </div>
                {!isFullscreen && (
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors border border-gray-100 dark:border-slate-800 shrink-0"
                        title="Full Screen"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className={cn(
                            "h-full rounded-full",
                            activeTab === "Easy" ? "bg-emerald-500" : activeTab === "Moderate" ? "bg-amber-500" : "bg-red-500"
                        )}
                        initial={false}
                        animate={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-mono shrink-0">
                    {currentIndex + 1}/{filtered.length}
                </span>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800 p-5 sm:p-6"
                >
                    {/* Question text */}
                    <p className={cn(
                        "font-medium text-gray-900 dark:text-slate-100 mb-5 leading-relaxed",
                        isFullscreen ? "text-lg sm:text-xl" : "text-base"
                    )}>
                        <span className="text-gray-400 dark:text-slate-600 mr-2">Q{currentIndex + 1}.</span>
                        {current.text}
                    </p>

                    {/* Options */}
                    <div className="space-y-3">
                        {current.options.map((opt, idx) => {
                            const isThis = selectedOption === idx;
                            const isAnswer = idx === current.correctIndex;
                            const showResult = selectedOption !== null;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={selectedOption !== null}
                                    className={cn(
                                        "w-full flex items-center gap-3 rounded-xl border text-left transition-all duration-200",
                                        isFullscreen ? "px-5 py-3 text-[15px] sm:text-base" : "px-4 py-3 text-sm",
                                        showResult && isAnswer
                                            ? "border-emerald-300 bg-emerald-50/80 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                                            : showResult && isThis && !isAnswer
                                                ? "border-red-300 bg-red-50/80 dark:border-red-500/30 dark:bg-red-500/10"
                                                : isThis
                                                    ? "border-sky-300 bg-sky-50/50 dark:border-sky-500/30 dark:bg-sky-500/10"
                                                    : "border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <span className={cn(
                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                        showResult && isAnswer
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : showResult && isThis && !isAnswer
                                                ? "border-red-500 bg-red-500 text-white"
                                                : isThis
                                                    ? "border-sky-500 text-sky-600 dark:text-sky-400"
                                                    : "border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500"
                                    )}>
                                        {showResult && isAnswer ? (
                                            <Check className="w-4 h-4" />
                                        ) : showResult && isThis && !isAnswer ? (
                                            <XCircle className="w-4 h-4" />
                                        ) : (
                                            String.fromCharCode(65 + idx)
                                        )}
                                    </span>
                                    <span className={cn(
                                        "flex-1",
                                        showResult && isAnswer
                                            ? "text-emerald-800 dark:text-emerald-300 font-medium"
                                            : showResult && isThis && !isAnswer
                                                ? "text-red-800 dark:text-red-300 line-through opacity-70"
                                                : "text-gray-700 dark:text-slate-300"
                                    )}>
                                        {opt}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Result & Explanation */}
                    {selectedOption !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-5 space-y-3"
                        >
                            <div className={cn(
                                "flex items-center gap-2 text-sm font-semibold",
                                isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                            )}>
                                {isCorrect ? (
                                    <><CheckCircle2 className="w-5 h-5" /> Correct!</>
                                ) : (
                                    <><XCircle className="w-5 h-5" /> Incorrect</>
                                )}
                            </div>

                            <div className="space-y-3 mt-4">
                                {isCorrect ? (
                                    <div className={cn("text-gray-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-500/20", isFullscreen ? "text-[15px] sm:text-base p-4" : "text-sm")}>
                                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">Hint (Correct Option):</span>
                                        {current.hints[current.correctIndex]}
                                    </div>
                                ) : (
                                    <>
                                        <div className={cn("text-gray-600 dark:text-slate-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20", isFullscreen ? "text-[15px] sm:text-base p-4" : "text-sm")}>
                                            <span className="font-semibold text-red-700 dark:text-red-400 block mb-1">Hint (Your Answer):</span>
                                            {current.hints[selectedOption]}
                                        </div>
                                        <div className={cn("text-gray-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-500/20", isFullscreen ? "text-[15px] sm:text-base p-4" : "text-sm")}>
                                            <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">Hint (Correct Option):</span>
                                            {current.hints[current.correctIndex]}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Inline Nav Buttons (only show when NOT fullscreen to avoid duplication) */}
            {!isFullscreen && (
                <div className="flex items-center justify-between mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="dark:border-slate-700 dark:text-slate-300"
                    >
                        ← Previous
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleNext}
                        disabled={currentIndex >= filtered.length - 1}
                        className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 dark:from-sky-600 dark:to-blue-700"
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-[200] bg-gray-50 dark:bg-slate-950 flex flex-col">
                {/* Fixed Header */}
                <div className="flex-none bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between shadow-sm z-[210]">
                    <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 tracking-wide uppercase">{topicTitle}</span>
                        <h2 className="text-sm sm:text-base font-medium text-gray-900 dark:text-slate-100 mt-0.5">{subTopicTitle}</h2>
                    </div>
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-2 sm:p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
                        title="Close Full Screen (Esc)"
                    >
                        <X className="w-5 h-5 text-gray-700 dark:text-slate-300" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto w-full">
                    <div className="py-4">
                        {content}
                    </div>
                </div>

                {/* Fixed Footer with Nav */}
                <div className="flex-none bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 p-4 sm:p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[210]">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="dark:border-slate-700 dark:text-slate-300 w-32 sm:w-40"
                        >
                            ← Previous
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            disabled={currentIndex >= filtered.length - 1}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 dark:from-sky-600 dark:to-blue-700 w-32 sm:w-40"
                        >
                            Next →
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return content;
}

// ─── Step Chain Item ──────────────────────────────────────────────────────────
function StepChainItem({
    subTopic,
    index,
    total,
    isActive,
    isCompleted,
    onClick,
}: {
    subTopic: any;
    index: number;
    total: number;
    isActive: boolean;
    isCompleted: boolean;
    onClick: () => void;
}) {
    const hasEng = subTopic.english_video_url || subTopic.english_video_url_killer;
    const hasHin = subTopic.hinglish_video_url || subTopic.hinglish_video_url_killer;
    const videoCount = (hasEng ? 1 : 0) + (hasHin ? 1 : 0);
    const questionCount = subTopic.questions?.length || 0;

    return (
        <div className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
                <button
                    onClick={onClick}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 z-10",
                        isActive
                            ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30 ring-4 ring-sky-500/10"
                            : isCompleted
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600"
                    )}
                >
                    {isCompleted ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                    )}
                </button>
                {index < total - 1 && (
                    <div className={cn(
                        "w-0.5 flex-1 min-h-[40px] transition-colors",
                        isCompleted
                            ? "bg-emerald-400 dark:bg-emerald-500"
                            : "bg-gray-200 dark:bg-slate-800"
                    )} />
                )}
            </div>

            {/* Content */}
            <motion.div
                initial={false}
                animate={{
                    opacity: isActive ? 1 : 0.7,
                }}
                className={cn(
                    "flex-1 pb-6 cursor-pointer",
                    index === total - 1 && "pb-0"
                )}
                onClick={onClick}
            >
                <div className={cn(
                    "rounded-xl border p-4 transition-all duration-200",
                    isActive
                        ? "border-sky-200 dark:border-sky-500/30 bg-sky-50/50 dark:bg-sky-500/5 shadow-sm"
                        : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:bg-gray-50/80 dark:hover:bg-slate-800/40"
                )}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className={cn(
                                "font-semibold text-sm sm:text-base",
                                isActive
                                    ? "text-sky-900 dark:text-sky-300"
                                    : "text-gray-900 dark:text-slate-200"
                            )}>
                                {subTopic.sub_chapter_name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 line-clamp-1">
                                Part {subTopic.sub_chapter_order}
                            </p>
                        </div>
                        {isActive && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-sky-500 dark:text-sky-400"
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                        )}
                    </div>

                    {/* Mini stats */}
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {videoCount} videos
                        </span>
                        <span className="flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" />
                            Questions
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main Topic Page Client ──────────────────────────────────────────────────
export default function DynamicTopicPageClient({
    chapterData,
    initialPart,
    killerPlayerEnabled = false,
    userId,
    completedSubChapterCodes = [],
}: {
    chapterData: any;
    initialPart: string;
    killerPlayerEnabled?: boolean;
    userId: string;
    completedSubChapterCodes?: string[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Determine if we should constrain the view to a specific part range (e.g., from sprint dashboard)
    const endParamStr = searchParams.get('end');
    const isSprintRange = Boolean(endParamStr);
    const sprintStartOrder = Math.max(1, parseInt(initialPart) || 1);
    const sprintEndOrder = isSprintRange ? parseInt(endParamStr!) : null;

    const displaySubChapters = useMemo(() => {
        if (!chapterData || !chapterData.sub_chapters) return [];
        if (isSprintRange && sprintEndOrder) {
            const startIndex = Math.max(0, sprintStartOrder - 1);
            const endIndex = Math.max(startIndex, sprintEndOrder - 1);
            return chapterData.sub_chapters.slice(startIndex, endIndex + 1);
        }
        return chapterData.sub_chapters;
    }, [chapterData, isSprintRange, sprintStartOrder, sprintEndOrder]);

    // Reconstruct theme base on chapter subject
    const subjectTitle = chapterData.subject || "Physics";
    const gradient = subjectTitle.toLowerCase().includes("phys")
        ? "from-sky-500 via-blue-500 to-indigo-600 dark:from-indigo-700 dark:via-blue-800 dark:to-indigo-900"
        : subjectTitle.toLowerCase().includes("chem")
            ? "from-sky-400 via-cyan-500 to-blue-600 dark:from-sky-700 dark:via-cyan-800 dark:to-sky-900"
            : "from-sky-500 via-teal-500 to-cyan-600 dark:from-teal-700 dark:via-emerald-800 dark:to-teal-900";

    const subject = {
        title: subjectTitle,
        gradient: gradient,
    };

    // Calculate previously completed steps based on DB 
    const initialCompletedSteps = new Set<number>();
    let firstIncompleteStep = 0;
    let foundIncomplete = false;

    if (displaySubChapters) {
        displaySubChapters.forEach((st: any, i: number) => {
            if (completedSubChapterCodes.includes(st.sub_chapter_code)) {
                initialCompletedSteps.add(i);
            } else if (!foundIncomplete) {
                firstIncompleteStep = i;
                foundIncomplete = true;
            }
        });
    }

    const initialStep = foundIncomplete ? firstIncompleteStep : (isSprintRange ? 0 : Math.max(0, parseInt(initialPart) - 1));

    const [activeStep, setActiveStep] = useState(initialStep);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(initialCompletedSteps);

    // Sync state if props change from SSR (e.g., navigating between topics)
    const completedCodesStr = completedSubChapterCodes.join(",");
    const chapterId = chapterData?.id;

    useEffect(() => {
        const nextSteps = new Set<number>();
        let firstIncomplete = 0;
        let found = false;

        if (displaySubChapters) {
            displaySubChapters.forEach((st: any, i: number) => {
                if (completedSubChapterCodes.includes(st.sub_chapter_code)) {
                    nextSteps.add(i);
                } else if (!found) {
                    firstIncomplete = i;
                    found = true;
                }
            });
        }

        // When navigating to a brand new chapter/URL, overwrite completely to prevent stale data leaking
        setCompletedSteps(nextSteps);

        // Also sync the active step based on new props (only when navigating intentionally)
        const nextInitialStep = found ? firstIncomplete : (isSprintRange ? 0 : Math.max(0, parseInt(initialPart) - 1));
        setActiveStep(nextInitialStep);
    }, [chapterId, initialPart, displaySubChapters, isSprintRange]); // Deliberately dropped completedCodesStr to prevent background revalidations from resetting activeStep

    // Dedicated sync to fetch any newly completed stuff from background refreshes
    useEffect(() => {
        const nextSteps = new Set<number>();
        if (displaySubChapters) {
            displaySubChapters.forEach((st: any, i: number) => {
                if (completedSubChapterCodes.includes(st.sub_chapter_code)) {
                    nextSteps.add(i);
                }
            });
        }
        setCompletedSteps(prev => {
            const merged = new Set(prev);
            nextSteps.forEach(val => merged.add(val));
            return merged;
        });
    }, [completedCodesStr, chapterId]);

    const [activeSection, setActiveSection] = useState<"videos" | "questions">("videos");
    const [allQuestionsAttempted, setAllQuestionsAttempted] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [practiceState, setPracticeState] = useState<string>("checking");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Close modal on Escape key
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isFullscreen]);

    function togglePracticeFullscreen() {
        setIsFullscreen(v => !v);
    }

    if (!chapterData || !chapterData.sub_chapters || chapterData.sub_chapters.length === 0 || displaySubChapters.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">No content available for this chapter.</p>
            </div>
        );
    }

    const activeSubTopic = displaySubChapters[activeStep] || displaySubChapters[0];
    const hasQuestions = activeSubTopic.questions && activeSubTopic.questions.length > 0;
    const questionCount = activeSubTopic.questions?.length || 0;

    // Convert DB video URLs to frontend video mocks for now
    const videos: Video[] = [];

    // Choose appropriate DB columns based on the killer_player setting
    // Fall back to regular URL if killer URL is empty
    const engUrl = (killerPlayerEnabled && activeSubTopic.english_video_url_killer)
        ? activeSubTopic.english_video_url_killer
        : activeSubTopic.english_video_url;

    const hinUrl = (killerPlayerEnabled && activeSubTopic.hinglish_video_url_killer)
        ? activeSubTopic.hinglish_video_url_killer
        : activeSubTopic.hinglish_video_url;

    const isEngKiller = Boolean(killerPlayerEnabled && activeSubTopic.english_video_url_killer);
    const isHinKiller = Boolean(killerPlayerEnabled && activeSubTopic.hinglish_video_url_killer);
    
    const hasVideos = Boolean(engUrl || hinUrl);

    if (engUrl) {
        videos.push({
            id: activeSubTopic.id + '-v1',
            title: `${activeSubTopic.sub_chapter_name} — English`,
            language: "English",
            duration: "~7:00",
            url: engUrl,
            isKiller: isEngKiller
        });
    }

    if (hinUrl) {
        videos.push({
            id: activeSubTopic.id + '-v2',
            title: `${activeSubTopic.sub_chapter_name} — Hinglish`,
            language: "Hinglish",
            duration: "~7:00",
            url: hinUrl,
            isKiller: isHinKiller
        });
    }

    const handleStepClick = (index: number) => {
        setActiveStep(index);
        setActiveSection("videos");
        setAllQuestionsAttempted(false);
        setIsSidebarOpen(true);
    };

    const handleMarkComplete = () => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            next.add(activeStep);
            return next;
        });
        if (activeStep < displaySubChapters.length - 1) {
            setActiveStep(activeStep + 1);
            setActiveSection("videos");
            setAllQuestionsAttempted(false);
            setPracticeState("checking");
            setIsSidebarOpen(true);
        }
    };

    const progress = (completedSteps.size / displaySubChapters.length) * 100;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 dark:bg-slate-950">
            {/* ─── Header ──────────────────────────────────────────────── */}
            <div className={cn("bg-gradient-to-r text-white", subject.gradient)}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => router.push("/dashboard/ncert-to-neet-30-days")}
                            className="flex items-center gap-1.5 text-white hover:text-white text-sm font-semibold transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Sprint Dashboard
                        </button>
                        <button
                            onClick={() => router.push("/learn")}
                            className="flex items-center gap-1 text-white/60 hover:text-white text-sm transition-colors"
                        >
                            <BookOpen className="w-3.5 h-3.5" />
                            All Topics
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                                {subject.title}
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                                {chapterData.chapter_name}
                            </h1>
                            <p className="text-white/70 text-sm mt-2 max-w-lg">
                                {chapterData.chapter_short_description || `Complete mastery of ${chapterData.chapter_name}`}
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[180px]">
                            <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-white/80">Progress</span>
                                    <span className="font-mono text-white/90">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white rounded-full"
                                        initial={false}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                            <Award className="w-8 h-8 text-yellow-300/80" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─────────────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col lg:flex-row items-start relative">
                    {/* ─── Step Chain (Sidebar) ────────────────────────── */}
                    <div className={cn(
                        "order-2 lg:order-1 relative shrink-0 transition-all duration-300 ease-in-out overflow-hidden mt-8 lg:mt-0",
                        isSidebarOpen ? "w-full lg:w-[300px] opacity-100 lg:mr-8 lg:translate-x-0" : "hidden lg:block lg:w-0 opacity-0 lg:mr-0 lg:-translate-x-8"
                    )}>
                        <div className="lg:sticky lg:top-8 w-full lg:w-[300px]">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                Sub-Topics
                            </h3>
                            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pl-2 pr-2 -ml-2 -mr-2 pt-2 pb-4 
                                [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 
                                dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent">
                                {displaySubChapters.map((st: any, i: number) => (
                                    <StepChainItem
                                        key={st.id}
                                        subTopic={st}
                                        index={i}
                                        total={displaySubChapters.length}
                                        isActive={activeStep === i}
                                        isCompleted={completedSteps.has(i)}
                                        onClick={() => handleStepClick(i)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── Active Content ──────────────────────────────── */}
                    <div className="order-1 lg:order-2 flex-1 min-w-0 w-full relative">
                        {/* Desktop Toggle Button at Juncture */}
                        <div className="absolute top-1 -left-9 z-20 hidden lg:flex">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className={cn(
                                    "p-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500 rounded-full shadow-md text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-all hover:scale-110",
                                    !isSidebarOpen && "bg-sky-50 dark:bg-sky-500/30 text-sky-600 dark:text-sky-300 border-sky-300 dark:border-sky-500/50 shadow-lg translate-x-4"
                                )}
                                title={isSidebarOpen ? "Hide Sub-Topics" : "Show Sub-Topics"}
                            >
                                {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Section Tabs */}
                        {hasVideos || hasQuestions ? (
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800/50 rounded-xl p-1 mb-6">
                                <button
                                    onClick={() => { setActiveSection("videos"); setIsSidebarOpen(true); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        activeSection === "videos"
                                            ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <Play className="w-4 h-4" />
                                    Videos
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded-full",
                                        activeSection === "videos"
                                            ? "bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400"
                                            : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                                    )}>
                                        {videos.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => { setActiveSection("questions"); setIsSidebarOpen(false); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        activeSection === "questions"
                                            ? "bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm"
                                            : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    Questions
                                </button>
                            </div>
                        ) : null}

                        {/* Sub-topic title + fullscreen button */}
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="pl-6 lg:pl-0">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        {activeSubTopic.sub_chapter_name}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        <p className="text-sm text-gray-500 dark:text-slate-500">
                                            Part {activeSubTopic.sub_chapter_order}
                                        </p>
                                        {activeSection === "questions" && (
                                            <>
                                                <span className="text-gray-300 dark:text-slate-700 hidden sm:inline">•</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                        5 Easy
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                                        5 Moderate
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
                                                        5 Difficult
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Fullscreen button — only in questions section, and only when practice is active */}
                            {activeSection === "questions" && practiceState === "active" && (
                                <button
                                    onClick={togglePracticeFullscreen}
                                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                    title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-center"
                                >
                                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                    {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                                </button>
                            )}
                        </div>

                        {/* Section Content */}
                        <AnimatePresence mode="wait">
                            {!hasVideos && !hasQuestions ? (
                                <motion.div
                                    key="nothing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800 p-12 text-center min-h-[400px]"
                                >
                                    <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mb-6">
                                        <Sparkles className="w-8 h-8 text-sky-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Content Coming Soon</h3>
                                    <p className="text-gray-500 dark:text-slate-400 max-w-sm">
                                        We are actively updating the video lectures and practice questions for this sub-topic. Check back soon!
                                    </p>
                                </motion.div>
                            ) : activeSection === "videos" ? (
                                <motion.div
                                    key="videos"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {!hasVideos ? (
                                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800 p-12 text-center min-h-[400px]">
                                            <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mb-6">
                                                <Play className="w-8 h-8 text-sky-500 ml-1" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Videos Coming Soon</h3>
                                            <p className="text-gray-500 dark:text-slate-400 max-w-sm">
                                                The video lectures for this sub-topic are currently being updated. Check back shortly!
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                                {videos.map(video => (
                                                    <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
                                                ))}
                                            </div>

                                            {/* Language Legend */}
                                            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 mb-6">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                    English
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                                                    Hinglish
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="questions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {!hasQuestions ? (
                                        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 rounded-xl border border-gray-100 dark:border-slate-800 p-12 text-center min-h-[400px]">
                                            <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center mb-6">
                                                <HelpCircle className="w-8 h-8 text-sky-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Questions Coming Soon</h3>
                                            <p className="text-gray-500 dark:text-slate-400 max-w-sm">
                                                Our academic team is handpicking the best practice questions for this sub-topic. Check back shortly!
                                            </p>
                                        </div>
                                    ) : (
                                        <PracticeSession
                                            key={activeSubTopic.sub_chapter_code}
                                            title={`${activeSubTopic.sub_chapter_name} — Practice`}
                                            fullscreenTitle={activeSubTopic.sub_chapter_name}
                                            isFullscreen={isFullscreen}
                                            onCloseFullscreen={() => setIsFullscreen(false)}
                                            onStateChange={setPracticeState}
                                            onAllAnswered={() => {
                                                setAllQuestionsAttempted(true);
                                                handleMarkComplete();
                                            }}
                                            params={{
                                                user_id: userId,
                                                sub_chapter_code: activeSubTopic.sub_chapter_code,
                                                subject: chapterData.subject ?? "Physics",
                                                class_number: chapterData.class ?? 11,
                                                chapter_number: chapterData.chapter_number ?? 1,
                                                sub_chapter_no: activeSubTopic.sub_chapter_order ?? 1,
                                            }}
                                        />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>


                        {/* Mark Complete */}
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col items-center">
                            <Button
                                onClick={handleMarkComplete}
                                disabled={completedSteps.has(activeStep) || (hasQuestions ? !allQuestionsAttempted : false)}
                                className={cn(
                                    "w-full py-6 text-base font-semibold rounded-xl transition-all duration-200 shadow-sm",
                                    completedSteps.has(activeStep)
                                        ? "bg-emerald-500 text-white dark:bg-emerald-600 shadow-md shadow-emerald-500/20 cursor-default"
                                        : (hasQuestions && !allQuestionsAttempted)
                                            ? "bg-sky-50 text-sky-400 border border-sky-200/50 dark:bg-sky-900/20 dark:text-sky-500 dark:border-sky-800/50 opacity-100 cursor-not-allowed"
                                            : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700 shadow-lg shadow-sky-500/20"
                                )}
                            >
                                {completedSteps.has(activeStep) ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Completed
                                    </span>
                                ) : activeStep === chapterData.sub_chapters.length - 1 ? (
                                    <span className="flex items-center gap-2">
                                        <Award className="w-5 h-5" />
                                        Complete Topic
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Check className="w-5 h-5" />
                                        Mark Complete & Next
                                    </span>
                                )}
                            </Button>
                            {!completedSteps.has(activeStep) && hasQuestions && !allQuestionsAttempted && (
                                <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium flex items-center gap-1.5">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    Progress will be saved once you attempt all questions.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/80 hover:text-white backdrop-blur-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {selectedVideo.url ? (
                                selectedVideo.isKiller ? (
                                    <iframe
                                        style={{ display: 'block', margin: 'auto', width: '100%', height: '100%', aspectRatio: '1.7708830548926013' }}
                                        src={`https://killerplayer.com/watch/video/${selectedVideo.url}`}
                                        allow="autoplay; gyroscope; picture-in-picture;"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <ReactPlayer
                                        style={{ display: 'block', margin: 'auto', aspectRatio: '1.7708830548926013' }}
                                        src={selectedVideo.url.startsWith('http') ? selectedVideo.url : `https://www.youtube.com/watch?v=${selectedVideo.url}`}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                        playing={true}
                                        className="w-full h-full"
                                    />
                                )
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                                        <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                    </div>
                                    <p className="text-white font-medium text-lg text-center px-6">Playing: {selectedVideo.title}</p>
                                    <p className="text-white/50 text-sm mt-1">{selectedVideo.language} • {selectedVideo.duration}</p>
                                    <p className="text-amber-400 text-xs mt-3 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20 max-w-sm">
                                        Video URL not found in database. Please configure English/Hinglish URLs in Sub-Chapters.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

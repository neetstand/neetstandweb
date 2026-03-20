"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { submitDiagnosticTest } from "../actions";
import type { InteractionEvent } from "../actions";
import { Bookmark, Clock, ChevronLeft, ChevronRight, AlertCircle, Loader2, LayoutGrid, X } from "lucide-react";
import { cn } from "@/utils/cn";

const TEST_DURATION_MINUTES = 30;

type QuestionProps = {
    id: string;
    subject: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
};

export function DiagnosticTestClient({
    attemptId,
    startedAt,
    questions
}: {
    attemptId: string,
    startedAt: string,
    questions: QuestionProps[]
}) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
    const [visited, setVisited] = useState<Record<string, boolean>>(() => {
        if (questions.length > 0) return { [questions[0].id]: true };
        return {};
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [showMobilePalette, setShowMobilePalette] = useState(false);

    // ── Interaction Tracking ──
    const interactionsRef = useRef<InteractionEvent[]>([]);

    const recordInteraction = useCallback((type: InteractionEvent["type"], data?: Partial<InteractionEvent>) => {
        interactionsRef.current.push({
            type,
            timestamp: Date.now(),
            questionIndex: currentQuestionIndex,
            ...data,
        } as InteractionEvent);
    }, [currentQuestionIndex]);

    const checkTime = useCallback(() => {
        const start = new Date(startedAt).getTime();
        const now = new Date().getTime();
        const elapsedSeconds = Math.floor((now - start) / 1000);
        const totalSeconds = TEST_DURATION_MINUTES * 60;
        return totalSeconds - elapsedSeconds;
    }, [startedAt]);

    const answersRef = useRef(answers);
    const isSubmittingRef = useRef(isSubmitting);

    useEffect(() => {
        answersRef.current = answers;
        isSubmittingRef.current = isSubmitting;
    }, [answers, isSubmitting]);

    const interactionsSubmitRef = useRef(interactionsRef);

    const handleTimeUp = useCallback(async () => {
        if (isSubmittingRef.current) return;
        toast.error("Time is up! Auto-submitting your test.");
        setIsSubmitting(true);
        try {
            await submitDiagnosticTest(attemptId, answersRef.current, interactionsSubmitRef.current.current);
            router.push("/onboarding/diagnostic/complete");
        } catch (error) {
            toast.error("Failed to submit test. Please try again.");
            setIsSubmitting(false);
        }
    }, [attemptId, router]);

    const question = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (option: string) => {
        const previousAnswer = answers[question.id];
        if (previousAnswer && previousAnswer !== option) {
            recordInteraction("option_change", { questionIndex: currentQuestionIndex, option, previousOption: previousAnswer });
        } else if (!previousAnswer) {
            recordInteraction("option_select", { questionIndex: currentQuestionIndex, option });
        }
        setAnswers(prev => ({ ...prev, [question.id]: option }));
    };

    const handleClearResponse = () => {
        setAnswers(prev => {
            const next = { ...prev };
            delete next[question.id];
            return next;
        });
    };

    const handleMarkReview = () => {
        setReviewMarked(prev => ({ ...prev, [question.id]: !prev[question.id] }));
    };

    const goToQuestion = (index: number) => {
        recordInteraction("question_navigate", { questionIndex: index });
        setCurrentQuestionIndex(index);
        setVisited(prev => ({ ...prev, [questions[index].id]: true }));
        setShowMobilePalette(false);
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            setShowMobilePalette(true); // Open palette to submit
        } else {
            goToQuestion(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            goToQuestion(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitDiagnosticTest(attemptId, answers, interactionsRef.current);
            router.push("/onboarding/diagnostic/complete");
        } catch (error) {
            toast.error("Failed to submit test. Please try again.");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        let isTimeUp = false;

        const tick = () => {
            if (isTimeUp) return;
            const remaining = checkTime();
            if (remaining <= 0) {
                setTimeLeft(0);
                isTimeUp = true;
                handleTimeUp();
            } else {
                setTimeLeft(remaining);
            }
        };

        // Defer initial execution slightly to satisfy React cascading render rules
        const timeoutId = setTimeout(() => tick(), 0);

        const timerId = setInterval(() => {
            tick();
            if (isTimeUp) clearInterval(timerId);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(timerId);
        };
    }, [checkTime, handleTimeUp]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const getQuestionStatus = (qId: string) => {
        const isAnswered = !!answers[qId];
        const isMarked = !!reviewMarked[qId];
        const isVisited = !!visited[qId];

        if (isMarked && isAnswered) return "marked-answered";
        if (isMarked && !isAnswered) return "marked";
        if (isAnswered) return "answered";
        if (isVisited) return "not-answered";
        return "not-visited";
    };

    const getStatusColorClass = (status: string, isCurrent: boolean) => {
        let base = "font-medium transition-all shadow-sm flex items-center justify-center rounded-xl ";

        // Ring for current
        if (isCurrent) {
            base += "ring-4 ring-blue-500/30 scale-[1.05] z-10 font-bold ";
        } else {
            base += "hover:scale-105 hover:shadow-md ";
        }

        switch (status) {
            case "answered":
                return base + "bg-emerald-500 text-white dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500";
            case "not-answered":
                return base + "bg-amber-500 text-white dark:bg-amber-600 border border-amber-600 dark:border-amber-500";
            case "marked":
                return base + "bg-purple-500 text-white dark:bg-purple-600 border border-purple-600 dark:border-purple-500";
            case "marked-answered":
                // Half and half or just special border
                return base + "bg-purple-500 border-2 border-emerald-400 text-white dark:bg-purple-600 dark:border-emerald-500";
            case "not-visited":
            default:
                return base + "bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
        }
    };

    if (timeLeft === null || !question) return null; // Hydration guard

    const answeredCount = Object.keys(answers).length;

    return (
        <div className="w-full max-w-[1400px] h-[85vh] flex flex-col lg:flex-row gap-4 lg:gap-6 animate-in fade-in zoom-in-95 duration-500 relative -mt-20 sm:-mt-12 lg:mt-0">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden relative">

                {/* Header */}
                <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                            Q.{currentQuestionIndex + 1}
                        </span>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase",
                            question.subject.toLowerCase() === 'botany' || question.subject.toLowerCase() === 'zoology' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                question.subject.toLowerCase() === 'physics' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                                    question.subject.toLowerCase() === 'chemistry' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        )}>
                            {question.subject}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={cn("flex items-center gap-2 font-mono font-bold text-lg px-3 py-1.5 rounded-lg border shadow-sm transition-colors",
                            timeLeft < 300
                                ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 animate-pulse'
                                : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                        )}>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight hidden sm:inline mr-1">Total Time</span>
                            <Clock className="w-4 h-4" />
                            {formatTime(timeLeft)}
                        </div>
                        {/* Mobile Palette Toggle */}
                        <button
                            onClick={() => setShowMobilePalette(!showMobilePalette)}
                            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Question Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
                    <h2 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-slate-50 leading-relaxed mb-8">
                        Which of the following statements is true?
                    </h2>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {(Object.keys(question.options) as Array<keyof typeof question.options>).map((optKey) => {
                                const optionText = question.options[optKey];
                                if (!optionText) return null;

                                const isSelected = answers[question.id] === optKey;

                                return (
                                    <button
                                        key={optKey}
                                        onClick={() => handleAnswer(optKey)}
                                        className={cn("w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 flex items-start gap-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20",
                                            isSelected
                                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 dark:border-emerald-500 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-emerald-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-emerald-900'
                                        )}
                                    >
                                        <div className={cn("shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors",
                                            isSelected
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                        )}>
                                            {optKey}
                                        </div>
                                        <span className={cn("text-base md:text-lg leading-relaxed pt-1",
                                            isSelected ? "text-emerald-950 dark:text-emerald-100 font-medium" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {optionText}
                                        </span>
                                    </button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Action Footer */}
                <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleMarkReview}
                            className={cn("flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors text-sm md:text-base border shadow-sm",
                                reviewMarked[question.id]
                                    ? "bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200 dark:bg-purple-500/20 dark:border-purple-500/30 dark:text-purple-400 dark:hover:bg-purple-500/30"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            )}
                        >
                            <Bookmark className={cn("w-4 h-4", reviewMarked[question.id] && "fill-current")} />
                            <span className="hidden sm:inline">{reviewMarked[question.id] ? "Marked for Review" : "Mark for Review"}</span>
                        </button>

                        <button
                            onClick={handleClearResponse}
                            disabled={!answers[question.id]}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:hover:bg-transparent text-sm md:text-base border border-transparent"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className="flex items-center gap-1 md:gap-2 px-4 py-3 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Prev</span>
                        </button>
                        <button
                            onClick={handleNext}
                            className={cn("flex items-center gap-1 md:gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95",
                                isLastQuestion
                                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            )}
                        >
                            <span className="hidden sm:inline">{isLastQuestion ? "Finish" : "Save & Next"}</span>
                            <span className="sm:hidden">{isLastQuestion ? "Finish" : "Next"}</span>
                            {isLastQuestion ? null : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop for Mobile */}
            {showMobilePalette && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setShowMobilePalette(false)}
                />
            )}

            {/* Right Palette (Desktop & Mobile Slide-over) */}
            <div className={cn("fixed lg:relative inset-y-0 right-0 w-[85%] sm:w-80 lg:w-[340px] shrink-0 bg-white dark:bg-slate-900 lg:rounded-2xl shadow-2xl lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:border border-slate-100 dark:border-slate-800 flex flex-col z-50 h-[100dvh] lg:h-full transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
                showMobilePalette ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            )}>
                {/* Mobile Palette Header */}
                <div className="lg:hidden flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 pt-safe font-sans">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5 text-slate-500" />
                        Question Palette
                    </h3>
                    <button
                        onClick={() => setShowMobilePalette(false)}
                        className="p-2 text-slate-500 bg-white hover:bg-slate-200 rounded-full border border-slate-200 transition-colors shadow-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Overview */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-5 text-xs font-semibold">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-5 h-5 rounded-md bg-emerald-500 shadow-sm border border-emerald-600 flex items-center justify-center text-white"></div>
                            <span className="text-slate-600 dark:text-slate-400">Answered ({answeredCount})</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-5 h-5 rounded-md bg-amber-500 shadow-sm border border-amber-600"></div>
                            <span className="text-slate-600 dark:text-slate-400">Not Answered</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-5 h-5 rounded-md bg-white shadow-sm border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-600"></div>
                            <span className="text-slate-600 dark:text-slate-400">Not Visited</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-5 h-5 rounded-md bg-purple-500 shadow-sm border border-purple-600"></div>
                            <span className="text-slate-600 dark:text-slate-400">Marked</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap overflow-visible">
                            <div className="w-5 h-5 rounded-md bg-purple-500 shadow-sm border-2 border-emerald-400 border-l-purple-500 border-b-purple-500 shrink-0"></div>
                            <span className="text-slate-600 dark:text-slate-400">Marked & Answered</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5 hide-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-4">Questions Navigation</h3>
                    <div className="grid grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-2">
                        {questions.map((q, idx) => {
                            const status = getQuestionStatus(q.id);
                            const isCurrent = idx === currentQuestionIndex;
                            return (
                                <button
                                    key={q.id}
                                    onClick={() => goToQuestion(idx)}
                                    className={cn("aspect-square w-full", getStatusColorClass(status, isCurrent))}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Submit Block */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto shrink-0 pb-safe">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-emerald-600 dark:border-emerald-500 dark:hover:bg-emerald-500 transition-all shadow-xl shadow-slate-200 dark:shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Test"
                        )}
                    </button>
                    {answeredCount < questions.length && (
                        <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-3 font-medium">
                            {questions.length - answeredCount} questions not answered
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}


"use client";

import "./practice.css";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { QuestionCard } from "./QuestionCard";
import { generatePracticeSession, loadExistingPracticeSession } from "@/actions/practiceSession";
import type {
    PracticeQuestion,
    PracticeSessionParams,
    PracticeSessionResult,
    PreAnswer,
} from "@/actions/practiceSession";
import { saveTopicProgress } from "@/actions/practiceSession";
import {
    BookOpen, RotateCcw, XCircle, Trophy, Loader2,
    ChevronLeft, ChevronRight, RefreshCw, X,
} from "lucide-react";

interface PracticeSessionProps {
    params: PracticeSessionParams;
    title?: string;
    /** Sub-chapter name shown as the modal header title */
    fullscreenTitle?: string;
    /** When true, renders the session inside a fixed full-screen modal portal */
    isFullscreen?: boolean;
    onCloseFullscreen?: () => void;
    onAllAnswered?: () => void;
    onStateChange?: (state: SessionState) => void;
}

export type SessionState = "checking" | "idle" | "loading" | "active" | "error";

export function PracticeSession({
    params,
    title,
    fullscreenTitle,
    isFullscreen = false,
    onCloseFullscreen,
    onAllAnswered,
    onStateChange,
}: PracticeSessionProps) {
    const [state, setState] = useState<SessionState>("checking");

    useEffect(() => {
        if (onStateChange) onStateChange(state);
    }, [state, onStateChange]);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [preAnswers, setPreAnswers] = useState<Record<string, PreAnswer>>({});
    const [answeredMap, setAnsweredMap] = useState<Map<string, boolean>>(new Map());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResultModal, setShowResultModal] = useState(false);
    const [isSavingProgress, setIsSavingProgress] = useState(false);
    const [isPending, startTransition] = useTransition();

    const total = questions.length;
    const isAnswered = (uqId: string) => answeredMap.has(uqId) || uqId in preAnswers;
    // Returns true=correct, false=wrong, null=unanswered
    const getResult = (uqId: string): boolean | null => {
        if (answeredMap.has(uqId)) return answeredMap.get(uqId)!;
        if (uqId in preAnswers) return preAnswers[uqId].is_correct;
        return null;
    };
    const answeredCount = total > 0
        ? questions.filter((q) => isAnswered(q.user_question_id)).length
        : 0;
    const correctCount = questions.filter((q) => {
        if (answeredMap.has(q.user_question_id)) return answeredMap.get(q.user_question_id);
        return preAnswers[q.user_question_id]?.is_correct ?? false;
    }).length;
    const allAnswered = total > 0 && answeredCount === total;

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isFullscreen]);

    // Auto-check for existing session on mount
    useEffect(() => {
        let cancelled = false;
        async function check() {
            const result = await loadExistingPracticeSession(params);
            if (cancelled) return;
            if (result.status === "found") {
                setQuestions(result.questions);
                setPreAnswers(result.answers);
                const firstUnanswered = result.questions.findIndex(
                    (q) => !(q.user_question_id in result.answers)
                );
                setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
                setState("active");
            } else {
                setState("idle");
            }
        }
        check();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.user_id, params.sub_chapter_code]);

    async function startNewSession() {
        setState("loading");
        setAnsweredMap(new Map());
        setPreAnswers({});
        setQuestions([]);
        setErrorMsg("");
        setCurrentIndex(0);
        startTransition(async () => {
            const result: PracticeSessionResult = await generatePracticeSession(params);
            if (result.status === "error") {
                setErrorMsg(result.message);
                setState("error");
                return;
            }
            setQuestions(result.questions);
            setState("active");
        });
    }

    function handleAnswered(userQuestionId: string, isCorrect: boolean, selectedOptionId: string) {
        setAnsweredMap((prev) => new Map([...prev, [userQuestionId, isCorrect]]));
        setPreAnswers((prev) => ({
            ...prev,
            [userQuestionId]: { selected_option_id: selectedOptionId, is_correct: isCorrect },
        }));
    }

    const currentQuestion = questions[currentIndex];
    const isCurrentAnswered = currentQuestion ? isAnswered(currentQuestion.user_question_id) : false;
    const scorePercent = allAnswered && total > 0 ? Math.round((correctCount / total) * 100) : 0;

    // ── Helper: build the session UI (shared between normal + modal) ───────────
    function SessionUI() {
        return (
            <div className="ps-session">
                {/* ── Top bar ── */}
                <div className="ps-topbar" role="status" aria-label="Practice progress">
                    <span className="ps-topbar__counter">
                        Question {currentIndex + 1} <span className="ps-topbar__of">of {total}</span>
                    </span>
                    <div className="ps-progress__bar">
                        <div
                            className="ps-progress__fill"
                            style={{ width: `${(answeredCount / total) * 100}%` }}
                        />
                    </div>
                    <span className="ps-topbar__answered">{answeredCount}/{total} answered</span>
                </div>

                {/* ── Score banner ── */}
                {allAnswered && (
                    <div className={`ps-score ${scorePercent >= 60 ? "ps-score--pass" : "ps-score--fail"}`}>
                        <Trophy size={28} />
                        <div>
                            <p className="ps-score__headline">
                                {correctCount} / {total} correct · {scorePercent}%
                            </p>
                            <p className="ps-score__sub">
                                {scorePercent >= 80
                                    ? "Excellent work! 🎉"
                                    : scorePercent >= 60
                                        ? "Good effort! Keep going."
                                        : "Keep practising — you'll get there!"}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Question card ── */}
                {currentQuestion && (
                    <QuestionCard
                        key={currentQuestion.question_id}
                        question={currentQuestion}
                        index={currentIndex + 1}
                        onAnswered={handleAnswered}
                        preAnswer={preAnswers[currentQuestion.user_question_id]}
                    />
                )}

                {/* ── Prev / Next nav ── */}
                <div className="ps-nav">
                    <button
                        className="ps-btn ps-btn--secondary ps-nav__btn"
                        onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        aria-label="Previous question"
                        id="practice-prev-btn"
                    >
                        <ChevronLeft size={18} /> Previous
                    </button>

                    <div className="ps-nav__dots" role="tablist" aria-label="Question navigation">
                        {questions.map((q, i) => {
                            const result = getResult(q.user_question_id);
                            const active = i === currentIndex;
                            return (
                                <button
                                    key={q.question_id}
                                    role="tab"
                                    aria-selected={active}
                                    aria-label={`Question ${i + 1}${result !== null ? (result ? " (correct)" : " (wrong)") : ""}`}
                                    className={[
                                        "ps-nav__dot",
                                        active ? "ps-nav__dot--active" : "",
                                        result === true ? "ps-nav__dot--correct" : "",
                                        result === false ? "ps-nav__dot--wrong" : "",
                                    ].filter(Boolean).join(" ")}
                                    onClick={() => setCurrentIndex(i)}
                                />
                            );
                        })}
                    </div>

                    {currentIndex < total - 1 ? (
                        <button
                            className="ps-btn ps-btn--primary ps-nav__btn"
                            onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
                            disabled={!isCurrentAnswered}
                            aria-label="Next question"
                            id="practice-next-btn"
                            title={!isCurrentAnswered ? "Answer this question to continue" : undefined}
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            className={`ps-btn ps-nav__btn ${allAnswered ? "ps-btn--primary" : "ps-btn--secondary"}`}
                            disabled={!isCurrentAnswered || isSavingProgress}
                            aria-label="Finish practice"
                            id="practice-finish-btn"
                            title={!isCurrentAnswered ? "Answer this question to finish" : undefined}
                            onClick={async () => {
                                if (!allAnswered) return;
                                setIsSavingProgress(true);
                                await saveTopicProgress(params.user_id, params.sub_chapter_code, correctCount);
                                setIsSavingProgress(false);
                                setShowResultModal(true);
                            }}
                        >
                            {isSavingProgress ? <Loader2 size={16} className="animate-spin" /> : <>Finish <Trophy size={16} /></>}
                        </button>
                    )}
                </div>

                {/* Result Modal */}
                {showResultModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 text-center border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-5">
                                <Trophy size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {correctCount} / {total} Correct
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
                                {correctCount <= 4
                                    ? "Needs more practice. Review the videos again."
                                    : correctCount <= 7
                                        ? "You're getting there, but a bit more focus is needed."
                                        : correctCount <= 11
                                            ? "Good job! You have a solid understanding."
                                            : correctCount <= 14
                                                ? "Excellent! You have mastered most of this topic."
                                                : "Perfect! You're a master of this topic."}
                            </p>
                            <button
                                onClick={() => {
                                    setShowResultModal(false);
                                    if (isFullscreen && onCloseFullscreen) onCloseFullscreen();
                                    onAllAnswered?.();
                                }}
                                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all shadow-md shadow-sky-500/20"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Checking (auto-load) ──────────────────────────────────────────────────
    if (state === "checking") {
        return (
            <div className="ps-loading">
                <Loader2 size={36} className="ps-loading__spinner" />
                <p>Loading your practice session…</p>
            </div>
        );
    }

    // ── Idle ──────────────────────────────────────────────────────────────────
    if (state === "idle") {
        return (
            <div className="ps-idle">
                <BookOpen size={40} className="ps-idle__icon" />
                <h2 className="ps-idle__title">{title ?? "Practice Questions"}</h2>
                <p className="ps-idle__sub">15 questions · 5 Easy · 5 Medium · 5 Hard</p>
                <button id="start-practice-btn" className="ps-btn ps-btn--primary" onClick={startNewSession}>
                    Start Practice
                </button>
            </div>
        );
    }

    // ── Loading ───────────────────────────────────────────────────────────────
    if (state === "loading") {
        return (
            <div className="ps-loading">
                <Loader2 size={36} className="ps-loading__spinner" />
                <p>Generating your practice set…</p>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (state === "error") {
        return (
            <div className="ps-error">
                <XCircle size={36} className="ps-error__icon" />
                <p className="ps-error__message">{errorMsg}</p>
                <button className="ps-btn ps-btn--secondary" onClick={startNewSession}>
                    <RotateCcw size={16} /> Try Again
                </button>
            </div>
        );
    }

    // ── Active — render inline or inside a portal modal ───────────────────────
    if (isFullscreen) {
        return createPortal(
            <div className="ps-modal-overlay" role="dialog" aria-modal="true" aria-label="Practice questions fullscreen">
                <div className="ps-modal">
                    {/* Modal header */}
                    <div className="ps-modal__header">
                        <h2 className="ps-modal__title">
                            {fullscreenTitle ?? title ?? "Practice Questions"}
                        </h2>
                        <button
                            className="ps-modal__close"
                            onClick={onCloseFullscreen}
                            aria-label="Close fullscreen"
                            title="Close (Esc)"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Modal body — same session UI */}
                    <div className="ps-modal__body">
                        {SessionUI()}
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return SessionUI();
}

"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { ImageCarousel } from "./ImageCarousel";
import type { PracticeQuestion, PracticeOption, PreAnswer } from "@/actions/practiceSession";
import { submitPracticeAnswer } from "@/actions/practiceSession";
import { submitQuestionChallenge, getChallengeIssueTypes } from "@/actions/challenge";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuestionCardProps {
    question: PracticeQuestion;
    index: number;        // 1-based display number
    onAnswered?: (user_question_id: string, is_correct: boolean, selected_option_id: string) => void;
    /** Pre-filled answer (restored from a saved session) */
    preAnswer?: PreAnswer;
}

const DIFFICULTY_STYLES: Record<string, string> = {
    Easy: "pq-badge pq-badge--easy",
    Medium: "pq-badge pq-badge--medium",
    Hard: "pq-badge pq-badge--hard",
};

function resolveUrlsFromRaw(raw: string | null | undefined): string[] {
    if (!raw || raw.trim() === "") return [];
    return raw.split(",").map((f) => f.trim()).filter(Boolean);
}

export function QuestionCard({ question, index, onAnswered, preAnswer }: QuestionCardProps) {
    // If a preAnswer is provided, initialise as already answered
    const correctOptionId = question.options.find((o) => o.is_correct)?.option_id ?? "";

    const [selected, setSelected] = useState<string | null>(
        preAnswer?.selected_option_id ?? null
    );
    const [result, setResult] = useState<{ is_correct: boolean; correct_option_id: string } | null>(
        preAnswer
            ? { is_correct: preAnswer.is_correct, correct_option_id: correctOptionId }
            : null
    );
    const [loading, setLoading] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isChallenging, setIsChallenging] = useState(false);
    const [hasChallenged, setHasChallenged] = useState(!!question.is_challenged);
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const [issueTypes, setIssueTypes] = useState<string[]>([]);
    const [selectedIssue, setSelectedIssue] = useState("");
    const [userComment, setUserComment] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    const answered = result !== null;

    useEffect(() => {
        setHasChallenged(!!question.is_challenged);
    }, [question.is_challenged]);

    async function handleChallengeClick() {
        if (hasChallenged) return;
        setIsReportFormOpen((prev) => !prev);
        if (issueTypes.length === 0) {
            const res = await getChallengeIssueTypes();
            if (res.status === "success") {
                setIssueTypes(res.data);
            }
        }
    }

    async function handleConfirmChallengeClick() {
        if (!selectedIssue) {
            toast.error("Please select a valid problem description.");
            return;
        }
        if (selectedIssue === "Other Issue" && !userComment.trim()) {
            toast.error("Please describe your issue in the text box.");
            return;
        }

        // Open custom modal instead of window.confirm
        setIsConfirmDialogOpen(true);
    }

    async function executeChallengeSubmission(e: React.MouseEvent) {
        e.preventDefault();
        setIsConfirmDialogOpen(false);
        setIsChallenging(true);
        try {
            const res = await submitQuestionChallenge(question.question_id, selectedIssue, userComment);
            if (res.status === "success") {
                setHasChallenged(true);
                setIsReportFormOpen(false);
                toast.success("Thanks for your Feedback. Our Academic Team will look into the same and correct the question, if required. Please continue answering the questions for now.", { duration: 6000 });
            } else {
                toast.error(res.message || "Failed to submit challenge. Please try again.");
            }
        } catch (err: any) {
            toast.error("Failed to submit challenge");
        } finally {
            setIsChallenging(false);
        }
    }

    async function handleSelect(option: PracticeOption) {
        if (answered || loading) return;
        setSelected(option.option_id);
        setLoading(true);
        setError(null);

        const res = await submitPracticeAnswer(
            question.user_question_id,
            option.option_id,
            question.options.find((o) => o.is_correct)?.option_id ?? ""
        );

        setLoading(false);

        if (res.status === "error") {
            setError(res.message);
            setSelected(null);
            return;
        }

        setResult({ is_correct: res.is_correct, correct_option_id: res.correct_option_id });
        onAnswered?.(question.user_question_id, res.is_correct, option.option_id);
    }

    // ── Resolved option references ──────────────────────────────────────────
    const correctOption = question.options.find((o) => o.is_correct);
    const selectedOption = answered
        ? question.options.find((o) => o.option_id === selected)
        : null;

    // Hint images (already full CDN URLs from server action)
    const correctHintImages = answered ? resolveUrlsFromRaw(correctOption?.hint_image_url) : [];
    const wrongHintImages =
        answered && !result!.is_correct
            ? resolveUrlsFromRaw(selectedOption?.hint_image_url)
            : [];

    // Whether there's any hint content to show
    const hasCorrectHint = Boolean(correctOption?.option_hint) || correctHintImages.length > 0;
    const hasWrongHint = !result?.is_correct && (Boolean(selectedOption?.option_hint) || wrongHintImages.length > 0);
    const hasAnyHint = hasCorrectHint || hasWrongHint;



    function getOptionClass(option: PracticeOption): string {
        const base = "pq-option";
        if (!answered) {
            return selected === option.option_id
                ? `${base} pq-option--selected`
                : `${base} pq-option--idle`;
        }
        if (option.is_correct) return `${base} pq-option--correct`;
        if (selected === option.option_id && !option.is_correct) return `${base} pq-option--wrong`;
        return `${base} pq-option--idle pq-option--faded`;
    }

    return (
        <div className="pq-card" id={`question-${index}`}>
            {/* ── Header ── */}
            <div className="pq-card__header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="pq-card__number">Q{index}</span>
                    <span className={DIFFICULTY_STYLES[question.difficulty] ?? "pq-badge"}>
                        {question.difficulty}
                    </span>
                </div>
                <button
                    onClick={handleChallengeClick}
                    disabled={isChallenging || hasChallenged}
                    className={`flex items-center gap-1.5 text-xs transition-colors bg-transparent border-none ${hasChallenged
                        ? "text-red-500 cursor-not-allowed"
                        : "text-gray-400 hover:text-amber-500 dark:text-slate-500 dark:hover:text-amber-400 cursor-pointer"
                        }`}
                    title={hasChallenged ? "Question reported" : "Report incorrect question"}
                >
                    <Flag size={14} className={isChallenging ? "animate-pulse text-amber-500" : hasChallenged ? "fill-red-500 text-red-500" : ""} />
                    <span>{hasChallenged ? "Reported" : "Report"}</span>
                </button>
            </div>


            {/* ── Report Form Embed ── */}
            {isReportFormOpen && !hasChallenged && (
                <div className="bg-slate-50 border-t border-b p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-800">Report an Issue</h4>
                    <select
                        className="w-full p-2 text-sm border rounded bg-white text-slate-700"
                        value={selectedIssue}
                        onChange={(e) => setSelectedIssue(e.target.value)}
                    >
                        <option value="" disabled>Select the problem...</option>
                        {issueTypes.map((issue) => (
                            <option key={issue} value={issue}>{issue}</option>
                        ))}
                    </select>
                    {selectedIssue === "Other Issue" && (
                        <textarea
                            className="w-full p-2 text-sm border rounded bg-white text-slate-700"
                            placeholder="Please describe the problem you found..."
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            rows={3}
                        />
                    )}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setIsReportFormOpen(false)}
                            className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmChallengeClick}
                            disabled={isChallenging}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50 transition-colors"
                        >
                            {isChallenging ? "Reporting..." : "Submit Report"}
                        </button>
                    </div>
                </div>
            )}


            {/* ── Question Content ── */}
            <div className="flex flex-col md:flex-row md:items-start items-center gap-6 md:gap-4 mb-2">
                {/* Question Text (KaTeX rendered HTML) */}
                <div
                    className={cn(
                        "pq-card__text katex-rendered",
                        question.has_images ? "w-full md:w-3/5 text-center md:text-left" : "w-full text-left"
                    )}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />

                {/* Question Images */}
                {question.has_images && (
                    <div className="pq-card__images w-full md:w-2/5 flex justify-center md:justify-end mt-4 md:mt-0 relative z-0">
                        <ImageCarousel images={question.images} alt={`Question ${index} image`} />
                    </div>
                )}
            </div>

            {/* ── Options ── */}
            <div className="pq-card__options" role="radiogroup" aria-label="Answer options">
                {question.options.map((option) => (
                    <button
                        key={option.option_id}
                        id={`opt-${question.question_id}-${option.label}`}
                        className={getOptionClass(option)}
                        onClick={() => handleSelect(option)}
                        disabled={answered || loading}
                        role="radio"
                        aria-checked={selected === option.option_id}
                        aria-label={`Option ${option.label}`}
                    >
                        <span className="pq-option__label">{option.label}</span>
                        <span
                            className="pq-option__text katex-rendered"
                            dangerouslySetInnerHTML={{ __html: option.option_text }}
                        />
                        {answered && option.is_correct && (
                            <CheckCircle2 size={18} className="pq-option__icon pq-option__icon--correct" />
                        )}
                        {answered && selected === option.option_id && !option.is_correct && (
                            <XCircle size={18} className="pq-option__icon pq-option__icon--wrong" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── Error ── */}
            {error && <p className="pq-card__error">{error}</p>}

            {/* ── Post-submission feedback bar ── */}
            {answered && (
                <div className={`pq-card__feedback ${result.is_correct ? "pq-card__feedback--correct" : "pq-card__feedback--wrong"}`}>
                    {result.is_correct ? (
                        <span className="pq-card__feedback-text">
                            <CheckCircle2 size={16} /> Correct!
                        </span>
                    ) : (
                        <span className="pq-card__feedback-text">
                            <XCircle size={16} /> Incorrect — correct answer was{" "}
                            <strong>{correctOption?.label}</strong>
                        </span>
                    )}

                    {/* Hint toggle — only if there's something to show */}
                    {hasAnyHint && (
                        <button
                            className="pq-card__hint-btn"
                            onClick={() => setShowHint((v) => !v)}
                            aria-expanded={showHint}
                        >
                            <Lightbulb size={14} />
                            {showHint ? "Hide hint" : "Show hint"}
                            {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    )}
                </div>
            )}

            {/* ── Hint section ── */}
            {answered && showHint && hasAnyHint && (
                <div className="pq-card__hint-section">

                    {/* Wrong option hint — shown in red when user was incorrect */}
                    {hasWrongHint && (
                        <div className="pq-card__hint pq-card__hint--wrong">
                            <p className="pq-card__hint-label pq-card__hint-label--wrong">
                                <XCircle size={13} /> Your choice ({selectedOption?.label}) — incorrect
                            </p>
                            {selectedOption?.option_hint && (
                                <p
                                    className="katex-rendered"
                                    dangerouslySetInnerHTML={{ __html: selectedOption.option_hint }}
                                />
                            )}
                            {wrongHintImages.length > 0 && (
                                <div className="pq-card__hint-images">
                                    <ImageCarousel images={wrongHintImages} alt="Wrong option hint image" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Correct option hint — always shown in green */}
                    {hasCorrectHint && (
                        <div className="pq-card__hint pq-card__hint--correct">
                            <p className="pq-card__hint-label pq-card__hint-label--correct">
                                <CheckCircle2 size={13} /> {result!.is_correct ? "Your answer" : `Correct answer (${correctOption?.label})`} — explanation
                            </p>
                            {correctOption?.option_hint && (
                                <p
                                    className="katex-rendered"
                                    dangerouslySetInnerHTML={{ __html: correctOption.option_hint }}
                                />
                            )}
                            {correctHintImages.length > 0 && (
                                <div className="pq-card__hint-images">
                                    <ImageCarousel images={correctHintImages} alt="Correct answer hint image" />
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}

            {/* Custom AlertDialog Confirmation */}
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You are about to report this question. Our Academic Team will evaluate it. Once reported, this action cannot be reversed for this question.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={executeChallengeSubmission} className="bg-amber-600 hover:bg-amber-700 text-white">
                            Yes, report question
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

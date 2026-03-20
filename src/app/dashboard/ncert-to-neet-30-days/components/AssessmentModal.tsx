"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Clock, AlertCircle, CheckCircle2, XCircle,
    BookOpen, Zap, Target, ArrowRight, ArrowLeft,
    Atom, FlaskConical, Dna, Play, Menu, Trophy
} from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

// ─── Formatting Helper ────────────────────────────────────────────────────────
function formatTimeLeft(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ─── Modal Props ──────────────────────────────────────────────────────────────
interface AssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assessment: any;
    currentDayNumber: number;
    completedDaySet: Set<number>;
    allSprintDays: any[];
    subjectFocus?: "physics" | "chemistry" | "biology";
    isReview?: boolean;       // open directly in results/review mode
    onComplete?: () => void;  // fired when user finishes the test
}

export function AssessmentModal({
    isOpen,
    onClose,
    assessment,
    currentDayNumber,
    completedDaySet,
    allSprintDays,
    subjectFocus,
    isReview = false,
    onComplete,
}: AssessmentModalProps) {
    const [step, setStep] = useState<"instructions" | "test" | "results" | "review">(isReview ? "review" : "instructions");
    const [hasReadInstructions, setHasReadInstructions] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const defaultSubject = subjectFocus ?? "biology";
    const [activeSubject, setActiveSubject] = useState<"biology" | "chemistry" | "physics">(defaultSubject);
    const [showNavDrawer, setShowNavDrawer] = useState(false);

    // User Answers Tracking state
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [activeQuestionId, setActiveQuestionId] = useState<string>("q1");

    // Question distribution — when a subject plan is focused, all Qs go to that subject
    const totalQ = assessment?.questionCount || 0;
    const bioQ = subjectFocus ? (subjectFocus === "biology" ? totalQ : 0) : Math.ceil(totalQ * 0.5);
    const chemQ = subjectFocus ? (subjectFocus === "chemistry" ? totalQ : 0) : Math.round(totalQ * 0.3);
    const phyQ = subjectFocus ? (subjectFocus === "physics" ? totalQ : 0) : totalQ - Math.ceil(totalQ * 0.5) - Math.round(totalQ * 0.3);

    // Build Mock Question IDs based on totals
    const bioQs = Array.from({ length: bioQ }, (_, i) => `bio-${i + 1}`);
    const chemQs = Array.from({ length: chemQ }, (_, i) => `chem-${i + 1}`);
    const phyQs = Array.from({ length: phyQ }, (_, i) => `phy-${i + 1}`);

    const allSubjects = [
        { id: "biology", label: "Biology", icon: Dna, count: bioQ, qIds: bioQs, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { id: "chemistry", label: "Chemistry", icon: FlaskConical, count: chemQ, qIds: chemQs, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10" },
        { id: "physics", label: "Physics", icon: Atom, count: phyQ, qIds: phyQs, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    ] as const;
    // When a subject is focused, show only that tab
    const subjects = subjectFocus ? allSubjects.filter(s => s.id === subjectFocus) : allSubjects;

    // Syllabus Construction
    const getSyllabusTopics = () => {
        if (!assessment) return [];
        if (assessment.type === "diagnostic") {
            return ["Full Class 11 & 12 NEET Syllabus"];
        }

        let targetDays: number[] = [];
        if (assessment.coversDays) {
            targetDays = assessment.coversDays;
        } else {
            targetDays = [currentDayNumber];
        }

        const topics: string[] = [];
        targetDays.forEach(dayNum => {
            const dayData = allSprintDays.find(d => d.day === dayNum);
            if (dayData) {
                // Only include the focused subject's topics, or all if no focus
                if ((!subjectFocus || subjectFocus === "physics") && dayData.physics?.label) topics.push(`Physics: ${dayData.physics.label}`);
                if ((!subjectFocus || subjectFocus === "chemistry") && dayData.chemistry?.label) topics.push(`Chemistry: ${dayData.chemistry.label}`);
                if ((!subjectFocus || subjectFocus === "biology") && dayData.biology?.label) topics.push(`Biology: ${dayData.biology.label}`);
            }
        });
        return topics.length > 0 ? topics : ["No specific topics defined"];
    };

    const syllabusList = getSyllabusTopics();

    useEffect(() => {
        if (!isOpen) return;
        if (isReview) {
            // Jump straight to review — reset to first question, discard any stale step state
            setStep("review");
            setActiveQuestionId(allQIds[0] || "bio-1");
            setShowNavDrawer(false);
        } else {
            setStep("instructions");
            setHasReadInstructions(false);
            setAnswers({});
            setMarkedForReview(new Set());
            setActiveQuestionId(allQIds[0] || "bio-1");
            setShowNavDrawer(false);
        }
    }, [isOpen, isReview]);

    // Timer Logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === "test" && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && step === "test") {
            // Auto submit when time runs out
            setStep("results");
            onComplete?.();
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    // Navigation Logic
    const allQIds = [...bioQs, ...chemQs, ...phyQs];

    const handleNextQuestion = () => {
        const currentIndex = allQIds.indexOf(activeQuestionId);
        if (currentIndex < allQIds.length - 1) {
            const nextQId = allQIds[currentIndex + 1];
            setActiveQuestionId(nextQId);
            if (nextQId.startsWith("bio")) setActiveSubject("biology");
            else if (nextQId.startsWith("chem")) setActiveSubject("chemistry");
            else if (nextQId.startsWith("phy")) setActiveSubject("physics");
        } else {
            // End of test — submit
            setStep("results");
            onComplete?.();
        }
    };

    const handlePrevQuestion = () => {
        const currentIndex = allQIds.indexOf(activeQuestionId);
        if (currentIndex > 0) {
            const prevQId = allQIds[currentIndex - 1];
            setActiveQuestionId(prevQId);
            if (prevQId.startsWith("bio")) setActiveSubject("biology");
            else if (prevQId.startsWith("chem")) setActiveSubject("chemistry");
            else if (prevQId.startsWith("phy")) setActiveSubject("physics");
        }
    };

    // Reset state when modal opens with a new assessment
    useEffect(() => {
        if (isOpen && assessment) {
            setStep("instructions");
            setHasReadInstructions(false);
            setTimeLeft(assessment.duration * 60); // Convert mins to seconds
            setActiveSubject(subjectFocus ?? "biology");
            setAnswers({});
            setMarkedForReview(new Set());
            // Seed the very first question logically based on active focus
            if (subjectFocus === "physics" && phyQ > 0) setActiveQuestionId(phyQs[0]);
            else if (subjectFocus === "chemistry" && chemQ > 0) setActiveQuestionId(chemQs[0]);
            else if (bioQ > 0) setActiveQuestionId(bioQs[0]);
            else if (chemQ > 0) setActiveQuestionId(chemQs[0]);
            else if (phyQ > 0) setActiveQuestionId(phyQs[0]);
        }
    }, [isOpen, assessment]);

    if (!isOpen || !assessment) return null;

    const handleStartTest = () => {
        if (!hasReadInstructions) return;
        setStep("test");
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black backdrop-blur-sm"
            >
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: 20 }}
                    className="w-full h-full bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
                >
                    {/* ─── INSTRUCTIONS STATE ────────────────────────────────────── */}
                    {step === "instructions" && !isReview && (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                            {assessment.label}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                                            Prepare to test your knowledge.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                                {/* Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                        <Clock className="w-5 h-5 text-amber-500 mb-2" />
                                        <div className="text-sm text-gray-500 dark:text-slate-400">Duration</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{assessment.duration} Minutes</div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                        <Target className="w-5 h-5 text-sky-500 mb-2" />
                                        <div className="text-sm text-gray-500 dark:text-slate-400">Questions</div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">{assessment.questionCount} Total</div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 sm:col-span-2">
                                        <BookOpen className="w-5 h-5 text-emerald-500 mb-2" />
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">Coverage</div>
                                        <ul className="text-sm font-medium text-gray-900 dark:text-white space-y-1 list-disc list-inside">
                                            {syllabusList.map((topic, i) => (
                                                <li key={i}>{topic}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Rules */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-rose-500" />
                                        Test Rules & Instructions
                                    </h3>
                                    <ul className="space-y-4 text-gray-600 dark:text-slate-300">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-sky-500" />
                                            <span><strong>Strict Time Limit:</strong> You have exactly {assessment.duration} minutes to complete this test. The test will auto-submit when the timer hits zero.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span><strong>No Negative Marking:</strong> Attempt all questions! You will not lose points for incorrect answers.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
                                            <span><strong>Single Attempt:</strong> You cannot pause the timer or reattempt this specific test later. Ensure you are ready before clicking Start.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={cn(
                                        "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                                        hasReadInstructions
                                            ? "bg-sky-500 border-sky-500 text-white"
                                            : "border-gray-300 dark:border-slate-600 group-hover:border-sky-400"
                                    )}>
                                        {hasReadInstructions && <CheckCircle2 className="w-4 h-4" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={hasReadInstructions}
                                        onChange={(e) => setHasReadInstructions(e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300 select-none">
                                        I have read and understood all instructions.
                                    </span>
                                </label>

                                <Button
                                    onClick={handleStartTest}
                                    disabled={!hasReadInstructions}
                                    className="w-full sm:w-auto min-w-[160px] gap-2"
                                    size="lg"
                                >
                                    Start Test
                                    <Play className="w-4 h-4 fill-current" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ─── ACTIVE TEST STATE ─────────────────────────────────────── */}
                    {step === "test" && (
                        <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-950">
                            {/* Test Header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm z-10">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                                        {assessment.label}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {totalQ} Questions Remaining
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "px-4 py-2 rounded-lg font-mono text-xl font-bold flex items-center gap-2",
                                        timeLeft <= 60
                                            ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 animate-pulse"
                                            : "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-200"
                                    )}>
                                        <Clock className="w-5 h-5" />
                                        {formatTimeLeft(timeLeft)}
                                    </div>
                                    {/* Mobile hamburger — opens navigator drawer */}
                                    <button
                                        onClick={() => setShowNavDrawer(true)}
                                        className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="Open Question Navigator"
                                    >
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Subject Tabs */}
                            <div className="flex px-4 sm:px-6 py-3 gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                                {subjects.map(sub => {
                                    const SubIcon = sub.icon;
                                    const isActive = activeSubject === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => setActiveSubject(sub.id as any)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border",
                                                isActive
                                                    ? `border-transparent shadow-sm ${sub.bg} ${sub.color}`
                                                    : "border-gray-100 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <SubIcon className="w-4 h-4" />
                                            {sub.label}
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-[10px]",
                                                isActive ? "bg-white/50 dark:bg-black/20" : "bg-gray-100 dark:bg-slate-800"
                                            )}>
                                                {sub.count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Question Canvas */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                <div className="max-w-3xl mx-auto">
                                    {/* Mock Question */}
                                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-sm">
                                                {activeQuestionId.split('-')[1]}
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg leading-relaxed">
                                                Mock generated question text for {activeQuestionId} goes here. The testing engine logic is currently in development mode.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => {
                                                const isSelected = answers[activeQuestionId] === i;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setAnswers(prev => ({ ...prev, [activeQuestionId]: i }))}
                                                        className={cn(
                                                            "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all font-medium",
                                                            isSelected
                                                                ? "border-sky-500 bg-sky-50 text-sky-900 dark:bg-sky-500/10 dark:text-sky-200"
                                                                : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                                                            isSelected ? "border-sky-500 text-sky-600" : "border-gray-300 dark:border-slate-600"
                                                        )}>
                                                            {['A', 'B', 'C', 'D'][i]}
                                                        </div>
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Test Controls */}
                                    <div className="flex items-center justify-between mt-8">
                                        <Button
                                            variant={markedForReview.has(activeQuestionId) ? "default" : "outline"}
                                            size="lg"
                                            className={markedForReview.has(activeQuestionId) ? "bg-amber-500 hover:bg-amber-600 text-white border-none" : "gap-2"}
                                            onClick={() => {
                                                setMarkedForReview(prev => {
                                                    const next = new Set(prev);
                                                    if (next.has(activeQuestionId)) next.delete(activeQuestionId);
                                                    else next.add(activeQuestionId);
                                                    return next;
                                                })
                                            }}
                                        >
                                            {markedForReview.has(activeQuestionId) ? "Unmark Review" : "Mark for Review"}
                                        </Button>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="secondary"
                                                size="lg"
                                                onClick={handlePrevQuestion}
                                                disabled={allQIds.indexOf(activeQuestionId) === 0}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                size="lg"
                                                className="bg-sky-600 hover:bg-sky-700 text-white gap-2"
                                                onClick={handleNextQuestion}
                                            >
                                                {allQIds.indexOf(activeQuestionId) === allQIds.length - 1 ? "Submit Test" : "Save & Next"}
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Drawer Tracking Grid */}
                                <div className="w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800 hidden lg:flex flex-col h-[calc(100vh-130px)] fixed top-[130px] right-0 flex-shrink-0">
                                    <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Question Navigator</h3>
                                        <div className="flex items-center gap-3 mt-3 text-[10px] font-medium uppercase text-gray-500 tracking-wider">
                                            <div className="flex flex-col items-center gap-1"><div className="w-4 h-4 rounded-full bg-emerald-500"></div>Answered</div>
                                            <div className="flex flex-col items-center gap-1"><div className="w-4 h-4 rounded-full bg-amber-400"></div>Ans+Review</div>
                                            <div className="flex flex-col items-center gap-1"><div className="w-4 h-4 rounded-full bg-violet-500"></div>Review</div>
                                            <div className="flex flex-col items-center gap-1"><div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-slate-800"></div>Pending</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                        {subjects.map(sub => (
                                            <div key={sub.id}>
                                                <div className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-2">{sub.label}</div>
                                                <div className="grid grid-cols-5 gap-2">
                                                    {sub.qIds.map((qId, idx) => {
                                                        const isAns = answers[qId] !== undefined;
                                                        const isRev = markedForReview.has(qId);
                                                        const isActive = activeQuestionId === qId;

                                                        let colorClass = "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400";
                                                        if (isAns && isRev) colorClass = "bg-gradient-to-br from-emerald-500 to-amber-500 text-white";
                                                        else if (isAns) colorClass = "bg-emerald-500 text-white border-transparent";
                                                        else if (isRev) colorClass = "bg-violet-500 text-white font-bold border-transparent";

                                                        return (
                                                            <button
                                                                key={qId}
                                                                onClick={() => {
                                                                    setActiveSubject(sub.id as any);
                                                                    setActiveQuestionId(qId);
                                                                }}
                                                                className={cn(
                                                                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all hover:scale-105",
                                                                    colorClass,
                                                                    isActive && !isAns && !isRev ? "border-sky-500" : "border-transparent text-white",
                                                                    isActive ? "ring-2 ring-sky-300 ring-offset-1 dark:ring-offset-slate-900" : "border-slate-200 dark:border-slate-700"
                                                                )}
                                                            >
                                                                {idx + 1}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                                        <Button
                                            onClick={() => { setStep("results"); onComplete?.(); }}
                                            variant="outline"
                                            className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                        >
                                            Submit Entire Test
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* ── Mobile Navigator Drawer ── */}
                            <AnimatePresence>
                                {showNavDrawer && (
                                    <>
                                        {/* Backdrop */}
                                        <motion.div
                                            key="nav-backdrop"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowNavDrawer(false)}
                                            className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm lg:hidden"
                                        />
                                        {/* Drawer panel */}
                                        <motion.div
                                            key="nav-drawer"
                                            initial={{ x: "100%" }}
                                            animate={{ x: 0 }}
                                            exit={{ x: "100%" }}
                                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                                            className="fixed top-0 right-0 h-full w-[300px] max-w-[85vw] z-[120] bg-white dark:bg-slate-900 shadow-2xl flex flex-col lg:hidden"
                                        >
                                            {/* Drawer header */}
                                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Question Navigator</h3>
                                                <button
                                                    onClick={() => setShowNavDrawer(false)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {/* Legend */}
                                            <div className="flex items-center gap-3 px-4 py-3 text-[10px] font-medium uppercase text-gray-500 tracking-wider border-b border-gray-100 dark:border-slate-800">
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" />Answered</div>
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" />Ans+Rev</div>
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-500" />Review</div>
                                                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-slate-700" />Pending</div>
                                            </div>
                                            {/* Question grid */}
                                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                                {subjects.map(sub => (
                                                    <div key={sub.id}>
                                                        <div className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-2">{sub.label}</div>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {sub.qIds.map((qId, idx) => {
                                                                const isAns = answers[qId] !== undefined;
                                                                const isRev = markedForReview.has(qId);
                                                                const isActive = activeQuestionId === qId;
                                                                let colorClass = "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400";
                                                                if (isAns && isRev) colorClass = "bg-gradient-to-br from-emerald-500 to-amber-500 text-white";
                                                                else if (isAns) colorClass = "bg-emerald-500 text-white border-transparent";
                                                                else if (isRev) colorClass = "bg-violet-500 text-white font-bold border-transparent";
                                                                return (
                                                                    <button
                                                                        key={qId}
                                                                        onClick={() => {
                                                                            setActiveSubject(sub.id as any);
                                                                            setActiveQuestionId(qId);
                                                                            setShowNavDrawer(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all hover:scale-105",
                                                                            colorClass,
                                                                            isActive && !isAns && !isRev ? "border-sky-500" : "border-transparent",
                                                                            isActive ? "ring-2 ring-sky-300 ring-offset-1 dark:ring-offset-slate-900" : ""
                                                                        )}
                                                                    >
                                                                        {idx + 1}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Submit */}
                                            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                                                <Button
                                                    onClick={() => { setStep("results"); setShowNavDrawer(false); onComplete?.(); }}
                                                    variant="outline"
                                                    className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30"
                                                >
                                                    Submit Entire Test
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* ─── RESULTS STATE ─────────────────────────────────── */}
                    {step === "results" && (
                        <div className="flex flex-col h-full items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-950">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Test Submitted!
                            </h2>
                            <p className="text-gray-500 dark:text-slate-400 max-w-md mb-8">
                                Good job! You attempted {Object.keys(answers).length} out of {allQIds.length} questions.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => {
                                        setActiveQuestionId(allQIds[0]);
                                        setStep("review");
                                    }}
                                    className="px-8 gap-2"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Review Answers
                                </Button>
                                <Button size="lg" onClick={onClose} className="px-8">
                                    Back to Dashboard
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ─── REVIEW STATE ─────────────────────────────────── */}
                    {step === "review" && (() => {
                        // Deterministic "correct" answer per question (index 0–3)
                        // In production this would come from the DB. We use a stable hash.
                        const getCorrectIndex = (qId: string) => {
                            const hash = qId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
                            return hash % 4;
                        };

                        const correctIdx = getCorrectIndex(activeQuestionId);
                        const userIdx = answers[activeQuestionId]; // undefined if skipped
                        const isCorrect = userIdx !== undefined && userIdx === correctIdx;
                        const totalAnswered = Object.keys(answers).length;
                        const totalCorrect = allQIds.filter(qId => answers[qId] === getCorrectIndex(qId)).length;
                        const pct = allQIds.length > 0 ? Math.round((totalCorrect / allQIds.length) * 100) : 0;
                        const currentIdx = allQIds.indexOf(activeQuestionId);

                        return (
                            <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-950">
                                {/* Score Banner */}
                                <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-amber-500" />
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Review Mode</div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {totalCorrect}/{allQIds.length} correct &nbsp;<span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", pct >= 60 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400")}>{pct}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                                        Q {currentIdx + 1} / {allQIds.length}
                                    </div>
                                </div>

                                {/* Subject Tabs (read-only) */}
                                <div className="flex px-4 sm:px-6 py-3 gap-2 overflow-x-auto scrollbar-hide bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
                                    {subjects.map(sub => (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                setActiveSubject(sub.id as any);
                                                setActiveQuestionId(sub.qIds[0]);
                                            }}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border",
                                                activeSubject === sub.id
                                                    ? `border-transparent shadow-sm ${sub.bg} ${sub.color}`
                                                    : "border-gray-100 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <sub.icon className="w-4 h-4" />
                                            {sub.label}
                                            <span className={cn("px-2 py-0.5 rounded-full text-[10px]", activeSubject === sub.id ? "bg-white/50 dark:bg-black/20" : "bg-gray-100 dark:bg-slate-800")}>
                                                {sub.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Question */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                    <div className="max-w-3xl mx-auto">
                                        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                            {/* Status badge */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold text-sm">
                                                    {currentIdx + 1}
                                                </div>
                                                {userIdx === undefined ? (
                                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">Skipped</span>
                                                ) : isCorrect ? (
                                                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">
                                                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                                                    </span>
                                                )}
                                                {markedForReview.has(activeQuestionId) && (
                                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400">Marked for Review</span>
                                                )}
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-lg leading-relaxed mb-6">
                                                Mock generated question text for {activeQuestionId} goes here. The testing engine logic is currently in development mode.
                                            </p>

                                            {/* Options with answer highlighting */}
                                            <div className="space-y-3">
                                                {["Option A", "Option B", "Option C", "Option D"].map((opt, i) => {
                                                    const isCorrectOpt = i === correctIdx;
                                                    const isUserPick = i === userIdx;

                                                    let optClass = "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40 text-gray-500 dark:text-slate-500";
                                                    let circleClass = "border-gray-300 dark:border-slate-600 text-gray-400";

                                                    if (isCorrectOpt) {
                                                        optClass = "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-200";
                                                        circleClass = "border-emerald-500 bg-emerald-500 text-white";
                                                    } else if (isUserPick && !isCorrect) {
                                                        optClass = "border-rose-400 bg-rose-50 dark:bg-rose-500/10 text-rose-900 dark:text-rose-200";
                                                        circleClass = "border-rose-500 bg-rose-500 text-white";
                                                    }

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={cn("w-full flex items-center gap-4 p-4 rounded-xl border text-left font-medium", optClass)}
                                                        >
                                                            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0", circleClass)}>
                                                                {isCorrectOpt ? <CheckCircle2 className="w-3.5 h-3.5" /> : ['A', 'B', 'C', 'D'][i]}
                                                            </div>
                                                            <span>{opt}</span>
                                                            {isCorrectOpt && <span className="ml-auto text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">✓ Correct</span>}
                                                            {isUserPick && !isCorrect && <span className="ml-auto text-[11px] font-bold text-rose-600 dark:text-rose-400 shrink-0">Your answer</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex items-center justify-between mt-6">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handlePrevQuestion}
                                                disabled={currentIdx === 0}
                                                className="gap-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" /> Previous
                                            </Button>
                                            {currentIdx === allQIds.length - 1 ? (
                                                <Button size="lg" onClick={onClose} className="px-8">
                                                    Back to Dashboard
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="lg"
                                                    className="bg-sky-600 hover:bg-sky-700 text-white gap-2"
                                                    onClick={handleNextQuestion}
                                                >
                                                    Next <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


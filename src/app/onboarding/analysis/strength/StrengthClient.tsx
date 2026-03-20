"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { useRouter } from "next/navigation";
import { saveOnboardingStep, resetOnboarding } from "@/app/onboarding/actions";
import { useState } from "react";
import { toast } from "sonner";
import { Atom, FlaskConical, Dna, ChevronRight, BarChart3 } from "lucide-react";
import { SubjectDetailModal } from "./SubjectDetailModal";
import { Subject } from "@/lib/constants/neet-syllabus";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type StrengthLevel = "Weak" | "Moderate" | "Strong";

export default function StrengthClient({ chaptersBySubject }: { chaptersBySubject: Record<string, string[]> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [strengths, setStrengths] = useState<Record<string, StrengthLevel>>({
        Physics: "Moderate",
        Chemistry: "Moderate",
        Biology: "Moderate"
    });

    // Detailed ratings: { Physics: { "Rotational Motion": "Weak" }, ... }
    const [detailedRatings, setDetailedRatings] = useState<Record<string, Record<string, StrengthLevel>>>({});
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showRestartConfirmation, setShowRestartConfirmation] = useState(false);

    const handleStrengthChange = (subject: string, level: StrengthLevel) => {
        setStrengths(prev => ({ ...prev, [subject]: level }));
    };



    const handleGenerateClick = () => {
        setShowConfirmation(true);
    };

    const confirmGenerate = async () => {
        setIsModalOpen(false); // Ensure other modals are closed
        setShowConfirmation(false);
        setLoading(true);
        try {
            await saveOnboardingStep({
                subjectStrengths: strengths,
                chapterStrengths: detailedRatings,
                onboardingStatus: "PLAN_GENERATED"
            });
            setLoading(false);
            router.push("/onboarding/plan");
        } catch (error) {
            toast.error("Failed to save preferences");
            setLoading(false);

        }
    };

    const openDetailModal = (subject: string) => {
        if (subject === "Physics" || subject === "Chemistry" || subject === "Biology") {
            setSelectedSubject(subject as Subject);
            setIsModalOpen(true);
        }
    };

    const handleDetailSave = (subject: Subject, ratings: Record<string, StrengthLevel>) => {
        setDetailedRatings(prev => ({
            ...prev,
            [subject]: ratings
        }));
    };

    return (
        <StepLayout progress={85} showBack={false} className="-translate-y-10">
            <SubjectDetailModal
                key={selectedSubject ?? "empty"}
                subject={selectedSubject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialRatings={selectedSubject ? detailedRatings[selectedSubject] : {}}
                onSave={handleDetailSave}
                chapters={selectedSubject ? chaptersBySubject[selectedSubject] : []}
            />
            <div className="space-y-6 max-w-lg w-full">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
                        Make Your Plan More Accurate
                    </h1>
                    <p className="text-gray-600 dark:text-slate-400">
                        Better inputs = a sharper 30-day plan.
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                        W = Weak, M = Moderate, S = Strong
                    </p>
                </div>

                {/* Subject Table */}
                <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-[1.5fr_2fr_1.5fr] bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 p-4 text-sm font-medium text-gray-500 dark:text-slate-400">
                        <div>Subject</div>
                        <div className="text-center">Rate</div>
                        <div className="text-end">Detailed Analysis</div>
                    </div>

                    {/* Rows */}
                    {["Physics", "Chemistry", "Biology"].map((subject) => (
                        <div key={subject} className="grid grid-cols-[1.5fr_2fr_1.5fr] items-center p-4 border-b border-gray-50 dark:border-slate-800/50 last:border-0 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <div className="font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-2">
                                {subject === "Biology" && <Dna className="w-4 h-4 text-green-500" />}
                                {subject === "Physics" && <Atom className="w-4 h-4 text-purple-500" />}
                                {subject === "Chemistry" && <FlaskConical className="w-4 h-4 text-blue-500" />}
                                <span className="hidden sm:inline">{subject}</span>
                                <span className="sm:hidden">{subject.slice(0, 3)}</span>
                            </div>

                            <div className="flex justify-center">
                                <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                                    {(["Weak", "Moderate", "Strong"] as StrengthLevel[]).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => handleStrengthChange(subject, level)}
                                            title={level}
                                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-[10px] font-bold
                                                ${strengths[subject] === level
                                                    ? 'bg-white text-black shadow-sm dark:bg-emerald-600 dark:text-white'
                                                    : 'text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            {level[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                {detailedRatings[subject] && Object.keys(detailedRatings[subject]).length > 0 ? (
                                    // Rated State (Static)
                                    <button
                                        onClick={() => openDetailModal(subject)}
                                        className="relative group text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all font-medium border bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <BarChart3 className="w-3.5 h-3.5" />
                                        {Object.keys(detailedRatings[subject]).length} Rated
                                        <ChevronRight className="w-3 h-3 opacity-50" />
                                    </button>
                                ) : (
                                    // Unrated State (Rotating Border Animation - Size Matched)
                                    <button
                                        onClick={() => openDetailModal(subject)}
                                        className="relative inline-flex overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-50 group hover:scale-105 transition-transform"
                                    >
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBD5E1_0%,#059669_50%,#CBD5E1_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#1e293b_0%,#10B981_50%,#1e293b_100%)]" />
                                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 backdrop-blur-3xl gap-1.5">
                                            <BarChart3 className="w-3.5 h-3.5" />
                                            Analyze Chapters
                                            <ChevronRight className="w-3 h-3 opacity-50" />
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full flex flex-col items-center gap-3">
                    <BigButton
                        onClick={handleGenerateClick}
                        loading={loading}
                        className="text-xl py-6 cursor-pointer"
                    >
                        Generate 30-Day Plan
                    </BigButton>

                    <button
                        onClick={(e) => {
                            // e.preventDefault();
                            setShowRestartConfirmation(true);
                        }}
                        disabled={loading}
                        className="text-sm text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors tracking-widest uppercase hover:underline underline-offset-4 disabled:opacity-50"
                    >
                        Restart Onboarding
                    </button>
                </div>

                <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-gray-100 dark:border-slate-800">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-slate-50">Are you sure?</DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-slate-400">
                                This profile analysis cannot be repeated. Your 30-day plan will be generated based on these inputs.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmation(false)}
                                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmGenerate}
                                className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            >
                                Confirm & Generate
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showRestartConfirmation} onOpenChange={setShowRestartConfirmation}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-gray-100 dark:border-slate-800">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-slate-50">Restart Onboarding?</DialogTitle>
                            <DialogDescription className="text-gray-500 dark:text-slate-400">
                                Are you sure you want to restart? This will clear all your current progress and data.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                variant="outline"
                                onClick={() => setShowRestartConfirmation(false)}
                                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        await resetOnboarding();
                                    } finally {
                                        // Flush states synchronously as the redirect exception bubbles up.
                                        // This ensures the modal stays open and spinning during the network
                                        // request, but prevents the Next.js Component Cache from resurrecting
                                        // the trapped `true` states if the user navigates back later.
                                        setShowRestartConfirmation(false);
                                        setLoading(false);
                                    }
                                }}
                                className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500"
                            >
                                {loading ? "Restarting..." : "Yes, Restart"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div >
        </StepLayout >
    );
}

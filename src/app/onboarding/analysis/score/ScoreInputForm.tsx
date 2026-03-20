"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { RadioCard } from "@/components/onboarding/RadioCard";
import { saveOnboardingStep } from "@/app/onboarding/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const mockRangeMapper = (score: number) => {
    if (score < 300) return "< 300";
    if (score >= 700) return "700+";
    if (score >= 650) return "650+";
    if (score >= 600) return "600+";
    if (score >= 500) return "500+";
    if (score >= 400) return "400+";
    return "300+";
};

const determinePlan = (score: number) => {
    if (score >= 550) return "Toppers Plan (550+)";
    if (score >= 450) return "Challenger Plan (450-550)";
    return "Groundbreaker Plan (< 450)";
};

export function ScoreInputForm({
    isRepeater,
    initialScore,
    initialMockScore
}: {
    isRepeater: boolean;
    initialScore?: number | null;
    initialMockScore?: number | null;
}) {
    const router = useRouter();
    const [score, setScore] = useState<string>(initialScore ? initialScore.toString() : "");
    const [mockRange, setMockRange] = useState<string | null>(initialMockScore ? mockRangeMapper(initialMockScore) : null);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Sync state with server props in case Next.js reuses the component instance
    // or the Client Router Cache pushes new props without unmounting
    useEffect(() => {
        setScore(initialScore ? initialScore.toString() : "");
        setMockRange(initialMockScore ? mockRangeMapper(initialMockScore) : null);
    }, [initialScore, initialMockScore]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isRepeater) {
                const numericScore = parseInt(score);
                if (isNaN(numericScore) || numericScore < 0 || numericScore > 720) {
                    toast.error("Please enter a valid score (0-720)");
                    setLoading(false);
                    return;
                }
                const calculatedPlan = determinePlan(numericScore);
                await saveOnboardingStep({ lastNeetScore: numericScore, generatedPlan: calculatedPlan });
            } else {
                if (!mockRange) {
                    toast.error("Please select a score range");
                    setLoading(false);
                    return;
                }
                // Map range to an approximate average for storage
                const approximateScore = parseInt(mockRange.replace(/\D/g, '')) || 300;
                const calculatedPlan = determinePlan(approximateScore);
                await saveOnboardingStep({ averageMockScore: approximateScore, generatedPlan: calculatedPlan });
            }

            // Next.js client router cache aggressively traps generic `/onboarding` redirects
            // explicitly declaring the next path guarantees we escape the layout trap.
            setLoading(false);
            if (isRepeater) {
                router.push("/onboarding/diagnostic/intro");
            } else {
                router.push("/onboarding/analysis/strength");
            }
        } catch (error) {
            toast.error("Failed to save score");
            setLoading(false);
        }
    };

    if (isRepeater) {
        return (
            <div className="w-full space-y-8 flex flex-col items-center">
                <Input
                    type="number"
                    autoComplete="off"
                    name="neetstand_score"
                    placeholder={isFocused ? "" : "Enter score (e.g. 450)"}
                    value={score}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                            setScore("");
                            return;
                        }
                        const num = parseInt(val);
                        if (!isNaN(num) && num >= 0 && num <= 720) {
                            setScore(val);
                        }
                    }}
                    min={0}
                    max={720}
                    className="text-center text-3xl p-6 h-auto w-full max-w-xs font-bold transition-all"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && score) {
                            handleSubmit();
                        }
                    }}
                />
                <BigButton
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={!score}
                >
                    Continue
                </BigButton>
            </div>
        );
    }

    // Mock Options
    const ranges = ["< 300", "300+", "400+", "500+"
        , "600+", "650+", "700+"];

    return (
        <div className="w-full space-y-8 flex flex-col items-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {ranges.map((range) => (
                    <button
                        key={range}
                        onClick={() => setMockRange(range)}
                        className={`p-4 rounded-xl border-2 font-semibold transition-all cursor-pointer
                            ${mockRange === range
                                ? 'border-black bg-black text-white dark:bg-emerald-600 dark:border-emerald-600'
                                : 'border-gray-100 bg-white hover:border-gray-300 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600'
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            <BigButton
                onClick={handleSubmit}
                loading={loading}
                disabled={!mockRange}
                className="cursor-pointer"
            >
                Continue
            </BigButton>
        </div>
    );
}

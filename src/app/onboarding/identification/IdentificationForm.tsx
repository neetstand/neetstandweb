"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { RadioCard } from "@/components/onboarding/RadioCard";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { saveOnboardingStep } from "@/app/onboarding/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function IdentificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Use URL param for step to ensure it persists across revalidations/refreshes
    const step = (searchParams.get("step") as "appeared" | "class") || "appeared";
    
    const [loading, setLoading] = useState(false);
    const [localSelection, setLocalSelection] = useState<string | null>(null);

    // Sync local selection if state changes
    useEffect(() => {
        setLocalSelection(null);
        setLoading(false);
    }, [step]);

    const setStepInUrl = (newStep: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", newStep);
        router.push(`?${params.toString()}`);
    };

    const handleAppearedSelection = async (hasAppeared: boolean) => {
        setLocalSelection(hasAppeared ? "yes" : "no");
        if (hasAppeared) {
            setLoading(true);
            try {
                await saveOnboardingStep({
                    currentClass: "repeater",
                    attemptCount: 1
                });
                // Note: revalidatePath in the action might trigger a page refresh.
                // By using URL params for step, we stay on 'appeared' if it refreshes,
                // but the following push should move us forward.
                router.push("/onboarding/analysis/score");
            } catch (error) {
                toast.error("Failed to save progress");
                setLoading(false);
                setLocalSelection(null);
            }
        } else {
            setStepInUrl("class");
        }
    };

    const handleClassSelection = async (className: "11" | "12") => {
        setLocalSelection(className);
        setLoading(true);
        try {
            if (className === "11") {
                await saveOnboardingStep({ currentClass: "11", attemptCount: 0 });
                router.push("/onboarding/class-11");
            } else {
                await saveOnboardingStep({ currentClass: "12", attemptCount: 0 });
                router.push("/onboarding/diagnostic/intro");
            }
        } catch (error) {
            toast.error("Failed to save progress");
            setLoading(false);
            setLocalSelection(null);
        }
    };

    return (
        <>
            {/* Step 1: Appeared Before? */}
            {step === "appeared" && (
                <StepLayout progress={20} showBack={false} backHref="/onboarding/welcome" className="-translate-y-10">
                    <div className="w-full space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">
                            Have you appeared for the actual NEET exam before?
                        </h1>
                    </div>

                    <div className="w-full space-y-4 flex flex-col items-center">
                        <RadioCard
                            label="Yes"
                            subLabel="I have attempted NEET at least once."
                            onClick={() => !loading && handleAppearedSelection(true)}
                            selected={localSelection === "yes"}
                        />
                        <RadioCard
                            label="No"
                            subLabel="I am appearing for the first time."
                            onClick={() => !loading && handleAppearedSelection(false)}
                            selected={localSelection === "no"}
                        />
                    </div>
                    {loading && (
                        <div className="w-full max-w-sm mt-4">
                            <BigButton loading disabled variant="secondary" className="w-full py-4 text-base">
                                Saving...
                            </BigButton>
                        </div>
                    )}
                </StepLayout>
            )}

            {/* Step 2: Class Selection (If No) */}
            {step === "class" && (
                <StepLayout progress={40} showBack={false} backHref="#" className="-translate-y-10">
                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50">
                            Which class are you currently in?
                        </h1>
                    </div>

                    <div className="w-full space-y-4 flex flex-col items-center">
                        <RadioCard
                            label="Class 11"
                            onClick={() => !loading && handleClassSelection("11")}
                            selected={localSelection === "11"}
                        />
                        <RadioCard
                            label="Class 12"
                            onClick={() => !loading && handleClassSelection("12")}
                            selected={localSelection === "12"}
                        />
                    </div>
                    <button
                        onClick={() => !loading && setStepInUrl("appeared")}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 disabled:opacity-50"
                        disabled={loading}
                    >
                        Back
                    </button>
                    {loading && (
                        <div className="w-full max-w-sm mt-4">
                            <BigButton loading disabled variant="secondary" className="w-full py-4 text-base">
                                Saving...
                            </BigButton>
                        </div>
                    )}
                </StepLayout>
            )}
        </>
    );
}

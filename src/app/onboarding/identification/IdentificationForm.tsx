"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { RadioCard } from "@/components/onboarding/RadioCard";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { saveOnboardingStep } from "@/app/onboarding/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function IdentificationForm() {
    const router = useRouter();
    const [step, setStep] = useState<"appeared" | "class">("appeared");
    const [loading, setLoading] = useState(false);

    // Answer to "Have you appeared before?"
    const handleAppearedSelection = async (hasAppeared: boolean) => {
        if (hasAppeared) {
            // Yes -> Repeater
            setLoading(true);
            try {
                await saveOnboardingStep({
                    currentClass: "repeater",
                    attemptCount: 1 // Assumed > 0
                });
                // Next.js retains component state on router.push; explicitly clear loading
                // before transition to prevent infinite spinners on "Back" or "Restart"
                setLoading(false);
                router.push("/onboarding/analysis/score");
            } catch (error) {
                toast.error("Failed to save progress");
                setLoading(false);
            }
        } else {
            // No -> Ask Class
            setStep("class");
        }
    };

    const handleClassSelection = async (className: "11" | "12") => {
        setLoading(true);
        try {
            if (className === "11") {
                // Class 11 -> Early Exit
                await saveOnboardingStep({ currentClass: "11", attemptCount: 0 });
                setLoading(false);
                router.push("/onboarding/class-11");
            } else {
                // Class 12 -> Diagnostic
                await saveOnboardingStep({ currentClass: "12", attemptCount: 0 });
                setLoading(false);
                router.push("/onboarding/diagnostic/intro");
            }
        } catch (error) {
            toast.error("Failed to save progress");
            setLoading(false);
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
                            onClick={() => handleAppearedSelection(true)}
                            selected={false}
                        />
                        <RadioCard
                            label="No"
                            subLabel="I am appearing for the first time."
                            onClick={() => handleAppearedSelection(false)}
                            selected={false}
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
                            onClick={() => handleClassSelection("11")}
                            selected={false}
                        />
                        <RadioCard
                            label="Class 12"
                            onClick={() => handleClassSelection("12")}
                            selected={false}
                        />
                    </div>
                    <button
                        onClick={() => setStep("appeared")}
                        className="mt-4 text-sm text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
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

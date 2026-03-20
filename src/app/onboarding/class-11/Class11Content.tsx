"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { StepLayout } from "@/components/onboarding/StepLayout";
import { useRouter } from "next/navigation";
import { saveOnboardingStep } from "@/app/onboarding/actions";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

interface Class11ContentProps {
    initialNotified: boolean;
}

export function Class11Content({ initialNotified }: Class11ContentProps) {
    const router = useRouter();
    const [notified, setNotified] = useState(initialNotified);

    const handleNotify = async () => {
        try {
            await saveOnboardingStep({ onboardingStatus: "CLASS_11_WAITLIST" });
            setNotified(true);
            toast.success("You're on the list! We'll email you soon.");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <StepLayout progress={100} showBack={false} backHref="/onboarding/welcome" className="-translate-y-10">
            <div className="space-y-6 max-w-lg text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-50">
                    You’re Early — And That’s a Good Thing.
                </h1>

                <div className="space-y-4 text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
                    <p>
                        Currently, NeetStand is focused on performance optimization for Class 12 and repeaters.
                    </p>
                    <p>
                        In the next 3–4 months, we’ll launch a dedicated program for Class 11 aspirants.
                    </p>
                    <p className="font-medium text-gray-800 dark:text-slate-200">
                        We’ve enrolled you in our early access program.
                        You’ll be the first to know when it launches.
                    </p>
                    <p>
                        Genuinely, thank you for trusting us.
                    </p>
                </div>

                <div className="pt-8 w-full flex flex-col items-center">
                    {!notified ? (
                        <BigButton
                            onClick={handleNotify}
                            className="text-xl py-6"
                        >
                            👉 Notify Me When Available
                        </BigButton>
                    ) : (
                        <div className="flex flex-col items-center space-y-2 text-green-600 animate-in fade-in zoom-in">
                            <CheckCircle className="w-12 h-12" />
                            <span className="font-semibold text-lg">We'll be in touch!</span>
                        </div>
                    )}

                    <button
                        onClick={() => router.push("/onboarding/welcome")}
                        className="mt-8 text-sm text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors flex items-center gap-2"
                    >
                        Selected Class 11 by mistake? Restart Onboarding
                    </button>
                </div>
            </div>
        </StepLayout>
    );
}

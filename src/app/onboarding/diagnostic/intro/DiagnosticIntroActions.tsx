"use client";

import { BigButton } from "@/components/onboarding/BigButton";
import { useRouter } from "next/navigation";
import { saveOnboardingStep } from "@/app/onboarding/actions";
import { useState } from "react";
import { toast } from "sonner";
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
import { Loader2 } from "lucide-react";

export function DiagnosticIntroActions() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirmStart = async () => {
        setLoading(true);
        setShowConfirm(false);
        try {
            const { startDiagnosticTest } = await import("@/app/onboarding/diagnostic/actions");
            const res = await startDiagnosticTest();
            if (!res.success && res.redirect) {
                router.push(res.redirect);
            } else {
                router.push("/onboarding/diagnostic/test");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to start diagnostic");
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setLoading(true);
        try {
            await saveOnboardingStep({ onboardingStatus: "DIAGNOSTIC_SKIPPED" });
            router.push("/onboarding/analysis/strength");
        } catch (error) {
            toast.error("Failed to skip diagnostic");
            setLoading(false);
        }
    };

    return (
        <div className="pt-4 w-full flex flex-col items-center space-y-4">
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-gray-600 dark:text-gray-400">
                            Once the test starts, the timer begins. <strong><span className="text-red-500">You CAN NOT retake it</span></strong>, ensure you have 30 uninterrupted minutes for all subjects combined.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmStart} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Start Test Now
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <BigButton
                onClick={() => setShowConfirm(true)}
                loading={loading}
                className="text-xl py-6 cursor-pointer"
            >
                👉 Start Diagnostic Test
            </BigButton>

            <button
                onClick={handleSkip}
                disabled={loading}
                className="text-sm text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors tracking-widest uppercase hover:underline underline-offset-4 disabled:opacity-50 cursor-pointer"
            >
                Skip Diagnostic Test
            </button>
        </div>
    );
}

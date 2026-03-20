import { StepLayout } from "@/components/onboarding/StepLayout";
import { Loader2 } from "lucide-react";

export default function Class11Loading() {
    return (
        <StepLayout progress={100} showBack={false} backHref="/onboarding/welcome" className="-translate-y-10">
            <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-slate-600" />
            </div>
        </StepLayout>
    );
}

import { Loader2 } from "lucide-react";

export default function OnboardingLoading() {
    return (
        <div className="w-full max-w-3xl h-[80vh] flex items-center justify-center bg-white dark:bg-slate-950 rounded-[10px] shadow-sm -translate-y-10">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 dark:text-slate-600" />
        </div>
    );
}

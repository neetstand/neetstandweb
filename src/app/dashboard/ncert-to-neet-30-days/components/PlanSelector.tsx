"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateActiveSprintPlan } from "@/actions/sprintPlans";

export function PlanSelector({
    availablePlans,
    activePlanId,
    onRequiresPro,
    activeProductString
}: {
    availablePlans: any[];
    activePlanId: string | null;
    onRequiresPro?: () => void;
    activeProductString?: string | null;
}) {
    const router = useRouter();
    const [isChangingPlan, setIsChangingPlan] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<string | null>(activePlanId);

    const handlePlanSelect = async (planId: string) => {
        if (onRequiresPro) {
            onRequiresPro();
            return;
        }

        setIsChangingPlan(true);
        try {
            await updateActiveSprintPlan(planId);
            setCurrentPlanId(planId);
            router.refresh(); // forces a server refetch of the dashboard
        } catch (error) {
            console.error("Failed to select plan:", error);
        } finally {
            setIsChangingPlan(false);
        }
    };

    const getDisplayName = (baseName: string) => {
        if (!activeProductString) return baseName;

        // If it's the full bundle, just return base ("Topper Plan")
        if (["30 Day Sprint Plan", "Groundbreaker Plan", "Challenger Plan", "Topper Plan"].includes(activeProductString)) {
            return baseName;
        }

        // Example: baseName = "Topper Plan", activeProductString = "30 Day Physics"
        const tierPrefix = baseName.replace(" Plan", ""); // "Topper"
        // Return "Topper Physics 30 Day Plan"
        if (activeProductString.includes("Physics")) return `${tierPrefix} Physics 30 Day Plan`;
        if (activeProductString.includes("Chemistry")) return `${tierPrefix} Chemistry 30 Day Plan`;
        if (activeProductString.includes("Biology")) return `${tierPrefix} Biology 30 Day Plan`;

        return baseName;
    };

    return (
        <div className="mt-4 flex items-center gap-3">
            <select
                value={currentPlanId || ""}
                onChange={(e) => handlePlanSelect(e.target.value)}
                disabled={isChangingPlan}
                suppressHydrationWarning
                className="text-sm bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 pr-8 focus:ring-2 focus:ring-sky-500 outline-none transition-all disabled:opacity-50 font-medium"
            >
                {availablePlans.map(plan => (
                    <option key={plan.id} value={plan.id} suppressHydrationWarning>
                        {getDisplayName(plan.name)}
                    </option>
                ))}
            </select>
            {isChangingPlan && (
                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            )}
        </div>
    );
}

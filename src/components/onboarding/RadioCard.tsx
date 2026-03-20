"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface RadioCardProps {
    label: string;
    subLabel?: string;
    selected?: boolean;
    onClick: () => void;
    className?: string;
}

export function RadioCard({ label, subLabel, selected, onClick, className }: RadioCardProps) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "cursor-pointer w-full max-w-sm p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group text-left",
                selected
                    ? "border-black bg-gray-50 ring-1 ring-black/5 dark:border-emerald-500 dark:bg-emerald-900/20 dark:ring-emerald-500/20"
                    : "border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600",
                className
            )}
        >
            <div>
                <h3 className={cn("font-semibold text-lg", selected ? "text-black dark:text-emerald-400" : "text-gray-700 dark:text-slate-200")}>
                    {label}
                </h3>
                {subLabel && (
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{subLabel}</p>
                )}
            </div>

            <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                selected ? "border-black bg-black dark:border-emerald-500 dark:bg-emerald-500" : "border-gray-200 group-hover:border-gray-400 dark:border-slate-600 dark:group-hover:border-slate-500"
            )}>
                {selected && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
        </motion.div>
    );
}

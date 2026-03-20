"use client";

import { motion } from "framer-motion";

export function ProgressRing({ completedDays }: { completedDays: number }) {
    const totalDays = 30;
    const percentage = Math.round((completedDays / totalDays) * 100);
    const dashArrayVal = (completedDays / totalDays) * 97.4;

    return (
        <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke="currentColor"
                    className="text-gray-100 dark:text-slate-800"
                    strokeWidth="3"
                />
                <motion.circle
                    cx="18" cy="18" r="15.5" fill="none"
                    stroke="currentColor"
                    className="text-sky-500 dark:text-sky-400"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${dashArrayVal} 97.4`}
                    initial={false}
                    animate={{ strokeDasharray: `${dashArrayVal} 97.4` }}
                    transition={{ duration: 0.6 }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {percentage}%
                </span>
            </div>
        </div>
    );
}

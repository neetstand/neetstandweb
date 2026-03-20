"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/utils/cn";

interface StepLayoutProps {
    children: React.ReactNode;
    progress?: number;
    backHref?: string;
    showBack?: boolean;
    className?: string; // New prop for custom styles
}

export function StepLayout({ children, progress = 0, backHref, showBack = true, className }: StepLayoutProps) {
    return (
        <div className={cn("w-full max-w-3xl h-[80vh] rounded-[10px] bg-white dark:bg-slate-950 flex flex-col font-sans text-gray-900 dark:text-slate-50 overflow-hidden shadow-sm", className)}>
            {/* Top Progress Bar */}
            <div className="w-full h-1 bg-gray-50 dark:bg-slate-900 fixed top-0 left-0 z-50">
                <div
                    className="h-full bg-black dark:bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header / Nav */}
            <div className="fixed top-4 left-4 z-40">
                {showBack && backHref && (
                    <Link href={backHref} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center text-gray-500 dark:text-slate-400 hover:text-black dark:hover:text-slate-200">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                )}
            </div>

            <main className="flex-1 flex flex-col items-center p-6 relative overflow-y-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full max-w-md flex flex-col items-center text-center space-y-8 m-auto"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}

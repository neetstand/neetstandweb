"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FlaskConical, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { saveOnboardingStep } from "../actions";

export default function DiagnosticPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            // In a real app, this would start the test session.
            // For now, we simulate completion or taking the test.
            // Let's assume they skip to profiling for now as we don't have a test engine ready in this task.
            // Or better, simulate "taking" it and going to insight.

            // Update status
            await saveOnboardingStep({ onboardingStatus: "DIAGNOSTIC_TAKEN" });

            // Simulate delay then go to insight
            setTimeout(() => {
                router.push("/onboarding/insight");
            }, 1500);

        } catch (error) {
            toast.error("Failed to start diagnostic");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto text-center space-y-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center justify-center p-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 mb-6"
            >
                <FlaskConical size={48} />
            </motion.div>

            <div className="space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold"
                >
                    This Test Uses Patterns From the Last 10 Years of NEET
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 dark:text-slate-400"
                >
                    Your results will generate a personalized score projection.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <button
                    onClick={handleStart}
                    disabled={loading}
                    className="group relative px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-lg font-semibold hover:scale-105 hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all disabled:opacity-70 disabled:hover:scale-100"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Initializing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Begin Test <BrainCircuit className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </button>
            </motion.div>
        </div>
    );
}

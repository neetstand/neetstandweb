"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, BarChart3, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { saveOnboardingStep } from "../actions";
import { toast } from "sonner";

export default function IntentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSelect = async (path: "diagnostic" | "analyze" | "improve") => {
        setLoading(path);
        try {
            await saveOnboardingStep({ onboardingStatus: "INTENT_SELECTED" });

            if (path === "diagnostic") {
                router.push("/onboarding/diagnostic");
            } else if (path === "analyze") {
                router.push("/onboarding/analyze");
            } else {
                // "Improve Strategy" might map to analyze or a different flow
                // For now, let's map it to analyze/profiling as well, or maybe directly to dashboard if they want to explore?
                // The prompt says: "Improve My Score Strategy -> Get a personalized improvement path."
                // This likely leads to the same Profiling flow if no data exists.
                router.push("/onboarding/analyze");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save selection");
            setLoading(null);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl mx-auto space-y-12 text-center"
        >
            <div className="space-y-4">
                <motion.h1 variants={item} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-emerald-400 dark:to-sky-400 py-2">
                    Let’s Plan Your NEET Direction
                </motion.h1>
                <motion.p variants={item} className="text-xl text-slate-600 dark:text-slate-400">
                    Choose what you’d like to do today.
                </motion.p>
            </div>

            <motion.div variants={item} className="grid md:grid-cols-3 gap-6">
                {/* Option 1: Diagnostic */}
                <button
                    onClick={() => handleSelect("diagnostic")}
                    disabled={!!loading}
                    className="group relative p-8 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/10 text-left flex flex-col gap-4"
                >
                    <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 w-fit text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <FlaskConical size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Take the NEETStand Diagnostic Test</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Get a topic-level performance map using patterns from the last 10 years of NEET.
                        </p>
                    </div>
                    {loading === "diagnostic" && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                    )}
                </button>

                {/* Option 2: Analyze */}
                <button
                    onClick={() => handleSelect("analyze")}
                    disabled={!!loading}
                    className="group relative p-8 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all hover:shadow-xl hover:shadow-sky-500/10 text-left flex flex-col gap-4"
                >
                    <div className="p-4 rounded-xl bg-sky-100 dark:bg-sky-900/30 w-fit text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Analyze My Current Preparation</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Identify exactly where you’re losing marks and which topics need immediate attention.
                        </p>
                    </div>
                    {loading === "analyze" && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                        </div>
                    )}
                </button>

                {/* Option 3: Improve */}
                <button
                    onClick={() => handleSelect("improve")}
                    disabled={!!loading}
                    className="group relative p-8 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10 text-left flex flex-col gap-4"
                >
                    <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 w-fit text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                        <Rocket size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Improve My Score Strategy</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Get a personalized improvement path based on your current standing and goals.
                        </p>
                    </div>
                    {loading === "improve" && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 flex items-center justify-center rounded-2xl backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    )}
                </button>
            </motion.div>
        </motion.div>
    );
}

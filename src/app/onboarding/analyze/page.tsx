"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FlaskConical, Zap } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AnalyzePage() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from("profiles").select("onboarding_status").eq("id", user.id).single();
                if (profile?.onboarding_status === "DIAGNOSTIC_TAKEN" || profile?.onboarding_status === "COMPLETED") {
                    router.push("/onboarding/insight");
                    return;
                }
            }
            setChecking(false);
        };
        checkStatus();
    }, [router]);

    if (checking) return null; // Or loading spinner

    return (
        <div className="w-full max-w-4xl mx-auto space-y-12 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <h1 className="text-3xl md:text-5xl font-bold">
                    To calculate your exact score direction, we need:
                </h1>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Option 1: Diagnostic */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => router.push("/onboarding/diagnostic")}
                    className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left group"
                >
                    <div className="mb-6 p-4 bg-emerald-100 dark:bg-emerald-900/30 w-fit rounded-xl text-emerald-600 dark:text-emerald-400">
                        <FlaskConical size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Take Diagnostic Test</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Recommended for highest accuracy.</p>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-2 transition-transform inline-block">Start Now &rarr;</span>
                </motion.button>

                {/* Option 2: Quick Mapping */}
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => router.push("/onboarding/profiling")}
                    className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 transition-all text-left group"
                >
                    <div className="mb-6 p-4 bg-sky-100 dark:bg-sky-900/30 w-fit rounded-xl text-sky-600 dark:text-sky-400">
                        <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Quick 2-Minute Mapping</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Manual entry of score data.</p>
                    <span className="text-sky-600 dark:text-sky-400 font-medium group-hover:translate-x-2 transition-transform inline-block">Start Profiling &rarr;</span>
                </motion.button>
            </div>
        </div>
    );
}

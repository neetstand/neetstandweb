"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { saveOnboardingStep } from "../actions";

// -- Mock Data --
const MOCK_TOPICS = {
    weak: [
        { id: "p1", subject: "Physics", name: "Rotational Motion" },
        { id: "p2", subject: "Physics", name: "Ray Optics" },
        { id: "c1", subject: "Chemistry", name: "Thermodynamics" },
        { id: "c2", subject: "Chemistry", name: "Equilibrium" },
        { id: "b1", subject: "Biology", name: "Genetics" },
        { id: "b2", subject: "Biology", name: "Plant Physiology" },
    ],
    leverage: [
        { id: "p3", subject: "Physics", name: "Semiconductors" },
        { id: "p4", subject: "Physics", name: "Current Electricity" },
        { id: "c3", subject: "Chemistry", name: "Chemical Bonding" },
        { id: "c4", subject: "Chemistry", name: "Coordination Compounds" },
        { id: "b3", subject: "Biology", name: "Human Physiology" },
        { id: "b4", subject: "Biology", name: "Ecology" },
    ],
    precision: [
        { id: "p5", subject: "Physics", name: "Electrostatics details" },
        { id: "c5", subject: "Chemistry", name: "Organic Reaction Mechanisms" },
        { id: "b5", subject: "Biology", name: "Biotechnology Application" },
    ]
};

export default function ProfilingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [isRepeater, setIsRepeater] = useState<boolean | null>(null);
    const [lastScore, setLastScore] = useState(400); // Slider default
    const [highestMock, setHighestMock] = useState("");
    const [mockRange, setMockRange] = useState("");

    const [subjectConfidence, setSubjectConfidence] = useState({
        Physics: "",
        Chemistry: "",
        Biology: ""
    });

    const [selectedTopics, setSelectedTopics] = useState<Record<string, string>>({}); // topicId -> level
    const [barrier, setBarrier] = useState("");


    // Helpers
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const getScoreBand = () => {
        if (isRepeater) {
            const score = lastScore; // Simplification
            if (score < 550) return "weak";
            if (score < 650) return "leverage";
            return "precision";
        } else {
            // Map range to band
            if (mockRange === "Below 300" || mockRange === "300–450") return "weak";
            if (mockRange === "450–550") return "weak"; // Overlap handling
            if (mockRange === "550–650") return "leverage";
            return "precision";
        }
    };

    const getTopicsToDisplay = () => {
        const band = getScoreBand();
        // Return max 6-8 mixed topics based on band
        // For prototype, just returning from mock
        return MOCK_TOPICS[band as keyof typeof MOCK_TOPICS] || MOCK_TOPICS.weak;
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            // Compile data
            const data = {
                onboardingStatus: "PROFILING_COMPLETED",
                diagnosticData: {
                    isRepeater,
                    lastScore: isRepeater ? lastScore : null,
                    highestMock: isRepeater ? highestMock : null,
                    mockRange: !isRepeater ? mockRange : null,
                    subjectConfidence,
                    selectedTopics,
                    barrier
                },
                targetExamYear: new Date().getFullYear(), // Default current year
                attemptCount: isRepeater ? 1 : 0 // Rough estimate
            };

            // Clear local loading state before routing
            // because Next.js App Router caches component instances on Back/Restart
            setLoading(false);
            router.push("/onboarding/insight");
        } catch (error) {
            toast.error("Failed to save profile");
            setLoading(false);
        }
    };

    // Render Steps
    return (
        <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-center">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold">Have you appeared for NEET before?</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => { setIsRepeater(true); nextStep(); }}
                                className="w-full p-6 text-left border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all font-semibold text-lg"
                            >
                                Yes, I have written NEET
                            </button>
                            <button
                                onClick={() => { setIsRepeater(false); nextStep(); }}
                                className="w-full p-6 text-left border rounded-xl hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all font-semibold text-lg"
                            >
                                No, I am preparing for the first time
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {isRepeater ? (
                            <>
                                <h2 className="text-3xl font-bold">Your Score History</h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-500">Last NEET Score: <span className="text-emerald-600 font-bold text-lg">{lastScore}</span></label>
                                        <input
                                            type="range"
                                            min="0" max="720"
                                            value={lastScore}
                                            onChange={(e) => setLastScore(parseInt(e.target.value))}
                                            className="w-full accent-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-500">Highest Mock Test Score</label>
                                        <input
                                            type="number"
                                            min="0" max="720"
                                            value={highestMock}
                                            onChange={(e) => setHighestMock(e.target.value)}
                                            className="w-full p-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-emerald-500 outline-none"
                                            placeholder="e.g. 520"
                                        />
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        disabled={!lastScore || !highestMock}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold">Current Mock Score Range</h2>
                                <div className="grid gap-4">
                                    {["Below 300", "300–450", "450–550", "550–650", "650+"].map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => { setMockRange(range); nextStep(); }}
                                            className="p-4 border rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-500 text-left font-medium"
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold">Rate Your Confidence Honestly</h2>
                        <div className="space-y-6">
                            {["Physics", "Chemistry", "Biology"].map((sub) => (
                                <div key={sub} className="space-y-3">
                                    <label className="font-semibold text-lg">{sub}</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {["Weak", "Average", "Strong", "Very Strong"].map((lvl) => (
                                            <button
                                                key={lvl}
                                                onClick={() => setSubjectConfidence(prev => ({ ...prev, [sub]: lvl }))}
                                                className={`py-2 px-1 text-xs md:text-sm rounded-lg border transition-all ${subjectConfidence[sub as keyof typeof subjectConfidence] === lvl
                                                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={!subjectConfidence.Physics || !subjectConfidence.Chemistry || !subjectConfidence.Biology}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50"
                        >
                            Next Step
                        </button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold">Topic Level Check</h2>
                        <p className="text-slate-500">Based on your score band, how confident are you in these topics?</p>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {getTopicsToDisplay().map((topic) => (
                                <div key={topic.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{topic.subject}</span>
                                        <p className="font-semibold">{topic.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {["Weak", "Moderate", "Strong"].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setSelectedTopics(prev => ({ ...prev, [topic.id]: lvl }))}
                                                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${selectedTopics[topic.id] === lvl
                                                    ? lvl === "Weak" ? "bg-red-500 text-white border-red-500" :
                                                        lvl === "Moderate" ? "bg-yellow-500 text-white border-yellow-500" :
                                                            "bg-emerald-500 text-white border-emerald-500"
                                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold"
                        >
                            Continue
                        </button>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold">What is your biggest score barrier?</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {["Time management", "Concept clarity", "Silly mistakes", "Exam pressure", "Revision structure", "Not sure"].map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setBarrier(b)}
                                    className={`p-4 border rounded-xl text-left font-medium transition-all ${barrier === b
                                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                        : "hover:border-emerald-500/50"
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleComplete}
                            disabled={!barrier || loading}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Generating Plan..." : "Generate Precision Plan"}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, BarChart3, Target, Activity, CheckCircle2, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

import { CognitiveRadarChart } from "@/components/ui/CognitiveRadarChart";
import { fetchGlobalCognitiveProfile, fetchChapterCognitiveProfile } from "@/actions/cognitiveAnalytics";
import { fetchUserScorePredictions, PredictionStageData } from "@/actions/predictionAnalytics";
import { CognitiveScores, ChapterCognitiveProfile } from "@/lib/cognitive-analytics";
import { BookOpen, Beaker, Dna, Lock } from "lucide-react";

export function AnalyticsModal({
    isOpen,
    onClose,
    completedDays,
    chaptersBySubject = { physics: [], chemistry: [], biology: [] },
}: {
    isOpen: boolean;
    onClose: () => void;
    completedDays: number;
    chaptersBySubject?: { physics: {code: string; name: string}[]; chemistry: {code: string; name: string}[]; biology: {code: string; name: string}[]; };
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    type Tab = "overview" | "cognitive" | "syllabus";
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [cognitiveSubject, setCognitiveSubject] = useState<"global" | "physics" | "chemistry" | "biology">("global");
    const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

    const [globalScores, setGlobalScores] = useState<CognitiveScores | null>(null);
    const [chapterProfile, setChapterProfile] = useState<ChapterCognitiveProfile | null>(null);
    const [scorePredictions, setScorePredictions] = useState<PredictionStageData[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (!globalScores) {
                setIsLoading(true);
                fetchGlobalCognitiveProfile().then(res => {
                    setGlobalScores(res);
                    setIsLoading(false);
                });
            }
            if (!scorePredictions) {
                fetchUserScorePredictions().then(res => setScorePredictions(res));
            }
        } else {
            document.body.style.overflow = 'auto';
            setActiveTab("overview");
            setCognitiveSubject("global");
            setSelectedChapter(null);
        }
        return () => { document.body.style.overflow = 'auto'; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        if (selectedChapter) {
            setIsLoading(true);
            fetchChapterCognitiveProfile(selectedChapter).then(res => {
                setChapterProfile(res);
                setIsLoading(false);
            });
        } else {
            setChapterProfile(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChapter]);

    if (!mounted) return null;

    const totalDays = 30;
    const progress = Math.round((completedDays / totalDays) * 100);
    
    const latestPrediction = scorePredictions && scorePredictions.length > 0 
        ? scorePredictions[scorePredictions.length - 1] 
        : null;

    const subjectProgress = [
        { name: "Physics", val: progress > 0 ? progress - 2 : 0, color: "bg-sky-500 shadow-sky-500/30", text: "text-sky-500" },
        { name: "Chemistry", val: progress > 0 ? progress + 4 : 0, color: "bg-violet-500 shadow-violet-500/30", text: "text-violet-500" },
        { name: "Biology", val: progress > 0 ? progress + 8 : 0, color: "bg-emerald-500 shadow-emerald-500/30", text: "text-emerald-500" },
    ];

    const mainTabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "cognitive", label: "Cognitive Profile", icon: Target },
        { id: "syllabus", label: "Syllabus Completion", icon: CheckCircle2 }
    ] as const;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex flex-col max-h-[90vh]"
                    >
                        {/* Header Area */}
                        <div className="flex-shrink-0 border-b border-gray-100 dark:border-slate-800 relative bg-white dark:bg-slate-900 z-10">
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
                            <div className="p-6 pb-0">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Analytics Dashboard</h2>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">Track your Neetstand progress metrics.</p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Main Navigation Tabs */}
                                <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-transparent">
                                    {mainTabs.map(tab => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as Tab)}
                                                className={cn(
                                                    "px-1 pb-4 flex items-center gap-2 text-sm font-semibold transition-colors relative whitespace-nowrap",
                                                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {tab.label}
                                                {isActive && (
                                                    <motion.div layoutId="mainTab" className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto">
                            {/* OVERVIEW TAB */}
                            {activeTab === "overview" && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Target className="w-5 h-5" /></div>
                                                {latestPrediction && (
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex gap-1"><TrendingUp className="w-3 h-3"/>{latestPrediction.stage}</span>
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">
                                                {latestPrediction ? `${latestPrediction.predicted_lower} - ${latestPrediction.predicted_upper}` : "N/A"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">Predicted NEET Score</p>
                                        </div>
                                        <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg w-min mb-2"><Activity className="w-5 h-5" /></div>
                                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{progress}%</h3>
                                            <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
                                        </div>
                                        <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg w-min mb-2"><Activity className="w-5 h-5" /></div>
                                            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 mt-3">
                                                {latestPrediction ? `${Math.round(latestPrediction.confidence_score * 100)}%` : "N/A"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">Data Confidence</p>
                                        </div>
                                    </div>
                                    
                                    {/* Projection Trajectory Box */}
                                    <div className="w-full h-40 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 flex flex-col justify-end gap-2 overflow-hidden shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Score Projection Trajectory</h3>
                                            <span className="text-xs text-slate-400">Stages (S1 - S4)</span>
                                        </div>
                                        <div className="flex items-end justify-start gap-4 h-full relative">
                                            {/* Baseline of 720 points for scale visualization visually hidden but determines max height */}
                                            {(!scorePredictions || scorePredictions.length === 0) ? (
                                                <div className="w-full flex-1 flex items-center justify-center text-gray-400 text-sm h-full">Not Reached (Needs more data to project S1)</div>
                                            ) : scorePredictions.map((pred, idx) => {
                                                const lowerHeight = (pred.predicted_lower / 720) * 100;
                                                const upperHeight = (pred.predicted_upper / 720) * 100;
                                                return (
                                                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end flex-1 max-w-16">
                                                        <div className="w-full relative flex items-end justify-center group" style={{ height: `${upperHeight}%` }}>
                                                            {/* Error Margin visual (upper bound) */}
                                                            <motion.div
                                                                initial={{ height: 0 }} animate={{ height: '100%' }}
                                                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                                className="absolute bottom-0 w-full bg-indigo-100 dark:bg-indigo-900/30 border-t border-indigo-200 rounded-t"
                                                            />
                                                            {/* Actual lower bound solid */}
                                                            <motion.div
                                                                initial={{ height: 0 }} animate={{ height: `${(lowerHeight / upperHeight) * 100}%` }}
                                                                transition={{ duration: 0.8, delay: idx * 0.1 + 0.2 }}
                                                                className="absolute bottom-0 w-full bg-indigo-500 dark:bg-indigo-600 rounded-t shadow-inner shadow-white/20"
                                                            />
                                                            {/* Hover label */}
                                                            <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                                {pred.predicted_lower} - {pred.predicted_upper}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 font-bold">{pred.stage}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {/* Mini Global Radar */}
                                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center bg-indigo-50/30 dark:bg-indigo-900/10 min-h-[300px]">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Global Cognitive Footprint</h3>
                                        <p className="text-sm text-gray-500 mb-6 max-w-sm text-center">Your high-level strengths and weaknesses across all Bloom&apos;s Taxonomy dimensions.</p>
                                        {globalScores && globalScores.totalAttempted > 0 ? (
                                            <CognitiveRadarChart data={{
                                                memorization: globalScores.memorization,
                                                understanding: globalScores.understanding,
                                                application: globalScores.application,
                                                analysis: globalScores.analysis
                                            }} size={260} />
                                        ) : (
                                            <div className="w-full flex-1 flex items-center justify-center text-gray-400">No questions attempted yet.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* COGNITIVE PROFILE TAB */}
                            {activeTab === "cognitive" && (
                                <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
                                    <div className="bg-gray-100/80 p-1.5 rounded-xl flex gap-1 w-fit mx-auto lg:mx-0">
                                        {[
                                            { id: "global", label: "Global", color: "indigo" },
                                            { id: "physics", label: "Physics", color: "sky" },
                                            { id: "chemistry", label: "Chemistry", color: "violet" },
                                            { id: "biology", label: "Biology", color: "emerald" }
                                        ].map(s => (
                                            <button
                                                key={s.id} onClick={() => { setCognitiveSubject(s.id as "global" | "physics" | "chemistry" | "biology"); setSelectedChapter(null); }}
                                                className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all", cognitiveSubject === s.id ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700")}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[400px]">
                                        {/* Left Side: Chapter Select */}
                                        {cognitiveSubject !== "global" && (
                                            <div className="lg:col-span-4 bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col items-stretch">
                                                <div className="p-3 bg-white dark:bg-slate-800 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Select Chapter
                                                </div>
                                                <div className="overflow-y-auto max-h-[350px] p-2 space-y-1">
                                                    {chaptersBySubject[cognitiveSubject]?.length > 0 ? chaptersBySubject[cognitiveSubject].map(ch => (
                                                        <button
                                                            key={ch.code}
                                                            onClick={() => setSelectedChapter(ch.code)}
                                                            className={cn("w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors font-medium text-gray-700 dark:text-slate-300", selectedChapter === ch.code ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-100")}
                                                        >
                                                            {ch.name}
                                                        </button>
                                                    )) : <p className="text-sm p-4 text-gray-400">No chapters found.</p>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Right Side: Radar Display */}
                                        <div className={cn("rounded-2xl border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center p-8 bg-white shadow-sm", cognitiveSubject === "global" ? "lg:col-span-12" : "lg:col-span-8")}>
                                            {isLoading ? (
                                                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"/>
                                            ) : cognitiveSubject === "global" ? (
                                                 globalScores && globalScores.totalAttempted > 0 ? (
                                                    <CognitiveRadarChart data={{ memorization: globalScores.memorization, understanding: globalScores.understanding, application: globalScores.application, analysis: globalScores.analysis}} size={320} />
                                                 ) : <div className="text-gray-400">No global data</div>
                                            ) : !selectedChapter ? (
                                                <div className="text-center text-gray-500 max-w-xs">
                                                    <Target className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                    <p>Select a chapter from the list to reveal its cognitive breakdown.</p>
                                                </div>
                                            ) : chapterProfile?.isLocked ? (
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                        <Lock className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Chapter Locked</h4>
                                                    <p className="text-sm text-gray-500 max-w-sm">Complete all sub-topics in this chapter to unlock its cognitive skill analysis.</p>
                                                </div>
                                            ) : chapterProfile?.scores ? (
                                                <CognitiveRadarChart data={{ memorization: chapterProfile.scores.memorization, understanding: chapterProfile.scores.understanding, application: chapterProfile.scores.application, analysis: chapterProfile.scores.analysis}} size={320} />
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SYLLABUS COMPLETION TAB */}
                            {activeTab === "syllabus" && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Subject-wise Completion Pipeline
                                        </h3>
                                        <div className="space-y-6">
                                            {subjectProgress.map((subj, i) => (
                                                <div key={subj.name}>
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{subj.name}</span>
                                                        <span className={cn("text-xs font-bold", subj.text)}>{Math.max(0, Math.min(100, subj.val))}%</span>
                                                    </div>
                                                    <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, subj.val))}%` }}
                                                            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                                            className={cn("h-full rounded-full shadow-sm", subj.color)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LEARN_SUBJECTS, type SubjectData, type Topic } from "@/lib/constants/learn-data";
import {
    Atom, FlaskConical, Dna, ChevronRight, BookOpen,
    Clock, HelpCircle, Play, Sparkles, ArrowLeft,
    Zap, Flame, AudioWaveform, Eye, Orbit,
    Hexagon, TreePine, Flower2, Circle, HeartPulse, Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ElementType> = {
    Atom, FlaskConical, Dna, Zap, Flame, AudioWaveform, Eye, Orbit,
    Hexagon, TreePine, Flower2, Circle, HeartPulse, Globe,
};

function getIcon(name: string) {
    return iconMap[name] ?? BookOpen;
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
function SubjectCard({
    subject,
    isSelected,
    onClick,
}: {
    subject: SubjectData;
    isSelected: boolean;
    onClick: () => void;
}) {
    const Icon = getIcon(subject.icon);
    const totalTopics = subject.topics.length;
    const totalSubTopics = subject.topics.reduce((s, t) => s + t.subTopics.length, 0);

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative group w-full rounded-2xl p-[1px] transition-shadow duration-300 text-left",
                isSelected
                    ? "shadow-xl shadow-sky-500/10 dark:shadow-sky-500/20"
                    : "shadow-md hover:shadow-lg"
            )}
        >
            {/* Animated border */}
            <div className={cn(
                "absolute inset-0 rounded-2xl transition-opacity duration-300",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60"
            )}>
                <div className={cn("absolute inset-0 rounded-2xl bg-gradient-to-r", subject.gradient)} />
            </div>

            <div className={cn(
                "relative rounded-2xl p-6 transition-colors duration-300",
                isSelected
                    ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white"
                    : "bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
            )}>
                {/* Top Row */}
                <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                        "p-3 rounded-xl transition-colors",
                        isSelected
                            ? `bg-gradient-to-br ${subject.gradient} text-white`
                            : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full"
                        >
                            <Sparkles className="w-3 h-3" />
                            Selected
                        </motion.div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-1">{subject.title}</h3>
                <p className={cn(
                    "text-sm mb-4",
                    isSelected ? "text-slate-400" : "text-gray-500 dark:text-slate-500"
                )}>
                    {totalTopics} topics · {totalSubTopics} sub-topics
                </p>

                {/* Mini stat bar */}
                <div className="flex items-center gap-4 text-xs">
                    <span className={cn(
                        "flex items-center gap-1",
                        isSelected ? "text-slate-400" : "text-gray-400 dark:text-slate-500"
                    )}>
                        <Play className="w-3 h-3" />
                        {subject.topics.reduce((s, t) => s + t.totalVideos, 0)} videos
                    </span>
                    <span className={cn(
                        "flex items-center gap-1",
                        isSelected ? "text-slate-400" : "text-gray-400 dark:text-slate-500"
                    )}>
                        <HelpCircle className="w-3 h-3" />
                        {subject.topics.reduce((s, t) => s + t.totalQuestions, 0)} Qs
                    </span>
                </div>
            </div>
        </motion.button>
    );
}

// ─── Topic Row ────────────────────────────────────────────────────────────────
function TopicRow({ topic, subject, index }: { topic: Topic; subject: SubjectData; index: number }) {
    const router = useRouter();
    const Icon = getIcon(topic.icon);

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            onClick={() => router.push(`/learn/${subject.id}/${topic.id}`)}
            className="group w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-gray-200 dark:hover:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 transition-all duration-200 text-left"
        >
            {/* Icon */}
            <div className={cn(
                "shrink-0 p-2.5 rounded-lg bg-gradient-to-br text-white shadow-sm",
                subject.gradient
            )}>
                <Icon className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 text-sm sm:text-base truncate">
                    {topic.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-500 line-clamp-1 mt-0.5">
                    {topic.description}
                </p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500 shrink-0">
                <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {topic.subTopics.length}
                </span>
                <span className="flex items-center gap-1">
                    <Play className="w-3.5 h-3.5" />
                    {topic.totalVideos}
                </span>
                <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    {topic.totalQuestions}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {topic.estimatedTime}
                </span>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400 transition-colors shrink-0" />
        </motion.button>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearnPage() {
    const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
            {/* ─── Hero ───────────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-300/20 dark:bg-sky-500/5 rounded-full blur-3xl" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-500/5 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 sm:mb-14"
                    >
                        <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-3 py-1.5 rounded-full mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Start your learning journey
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                            Pick a Subject,{" "}
                            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
                                Master NEET
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                            Choose a subject below, then select a topic to unlock structured videos and practice questions.
                        </p>
                    </motion.div>

                    {/* ─── Subject Cards ───────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                        {LEARN_SUBJECTS.map((subject) => (
                            <SubjectCard
                                key={subject.id}
                                subject={subject}
                                isSelected={selectedSubject?.id === subject.id}
                                onClick={() =>
                                    setSelectedSubject(prev =>
                                        prev?.id === subject.id ? null : subject
                                    )
                                }
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Topics Panel ────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {selectedSubject && (
                    <motion.section
                        key={selectedSubject.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="max-w-4xl mx-auto px-4 sm:px-6 pb-16"
                    >
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    {selectedSubject.title}
                                    <span className="text-xs font-normal text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                        {selectedSubject.topics.length} topics
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-1">
                                    Select a topic to begin learning
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className="text-sm text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Change subject
                            </button>
                        </div>

                        {/* Topic List */}
                        <div className="space-y-3">
                            {selectedSubject.topics.map((topic, i) => (
                                <TopicRow
                                    key={topic.id}
                                    topic={topic}
                                    subject={selectedSubject}
                                    index={i}
                                />
                            ))}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
}

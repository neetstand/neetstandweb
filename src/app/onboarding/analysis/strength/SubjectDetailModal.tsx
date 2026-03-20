"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Subject } from "@/lib/constants/neet-syllabus";
import { useState } from "react";
import { Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type StrengthLevel = "Weak" | "Moderate" | "Strong";

interface SubjectDetailModalProps {
    subject: Subject | null;
    isOpen: boolean;
    onClose: () => void;
    initialRatings?: Record<string, StrengthLevel>;
    onSave: (subject: Subject, ratings: Record<string, StrengthLevel>) => void;
    chapters: string[];
}

export function SubjectDetailModal({ subject, isOpen, onClose, initialRatings = {}, onSave, chapters }: SubjectDetailModalProps) {
    const [ratings, setRatings] = useState<Record<string, StrengthLevel>>(initialRatings);

    // State initializes from prop. We rely on the parent to pass a unique 'key' 
    // to this component to force a reset when the subject changes.

    if (!subject) return null;

    const handleRatingChange = (chapter: string, level: StrengthLevel) => {
        setRatings(prev => ({ ...prev, [chapter]: level }));
    };

    const handleSave = () => {
        onSave(subject, ratings);
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:w-[540px] flex flex-col p-0 bg-white dark:bg-slate-950 border-l dark:border-slate-800">
                <SheetHeader className="px-6 py-6 border-b border-gray-100 dark:border-slate-800 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${subject === 'Biology' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                            subject === 'Physics' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                                'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold text-gray-900 dark:text-slate-50">{subject} Analysis</SheetTitle>
                            <SheetDescription className="text-gray-500 dark:text-slate-400">
                                Rate your confidence for each chapter. <span className="text-xs block mt-1 opacity-80">(W - Weak, M - Moderate, S - Strong)</span>
                            </SheetDescription>
                        </div>
                    </div>

                    {/* Fixed Legend - Half split on border */}
                    <div className="absolute bottom-0 right-[34px] translate-y-1/2 flex gap-2 bg-white dark:bg-slate-950 px-1 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider select-none">
                        <div className="w-6 text-center flex justify-center items-center">
                            <span>W</span>
                        </div>
                        <div className="w-6 text-center flex justify-center items-center">
                            <span>M</span>
                        </div>
                        <div className="w-6 text-center flex justify-center items-center">
                            <span>S</span>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative">
                    <div className="space-y-4">
                        {chapters.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-slate-400 py-8">No chapters found for this subject.</p>
                        ) : (
                            <motion.div
                                initial="hidden"
                                animate={isOpen ? "visible" : "hidden"}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.05 }
                                    }
                                }}
                                className="space-y-4"
                            >
                                {chapters.map((chapter) => (
                                    <motion.div
                                        key={chapter}
                                        variants={{
                                            hidden: { opacity: 0, y: 15 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
                                        }}
                                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-2.5 overflow-hidden">
                                            <BookOpen className="w-3.5 h-3.5 text-gray-400 mt-0.5 dark:text-slate-500 shrink-0" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300 leading-tight truncate-multiline">
                                                {chapter}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 shrink-0">
                                            {(["Weak", "Moderate", "Strong"] as StrengthLevel[]).map((level) => {
                                                const isSelected = ratings[chapter] === level;
                                                return (
                                                    <button
                                                        key={level}
                                                        onClick={() => handleRatingChange(chapter, level)}
                                                        title={level}
                                                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all text-[10px] font-bold
                                                            ${isSelected
                                                                ? 'border-black bg-black dark:border-emerald-500 dark:bg-emerald-500 text-transparent scale-110'
                                                                : 'border-slate-300 text-slate-400 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-slate-500 dark:text-slate-500'
                                                            }`}
                                                    >
                                                        {isSelected ? (
                                                            <div className="w-2 h-2 bg-white rounded-full" />
                                                        ) : (
                                                            <span>{level[0]}</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            onClick={handleSave}
                        >
                            Save Ratings
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

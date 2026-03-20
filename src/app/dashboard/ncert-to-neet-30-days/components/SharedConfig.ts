import { PRIORITY_CONFIG } from "@/lib/constants/sprint-data";
import { Atom, FlaskConical, Dna } from "lucide-react";

export const subjectIconMap: Record<string, React.ElementType> = {
    physics: Atom,
    chemistry: FlaskConical,
    biology: Dna,
};

export const subjectColors: Record<string, { text: string; bg: string; border: string; gradient: string }> = {
    physics: {
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
        border: "border-blue-200 dark:border-blue-500/20",
        gradient: "from-sky-500 via-blue-500 to-indigo-600",
    },
    chemistry: {
        text: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-50 dark:bg-cyan-500/10",
        border: "border-cyan-200 dark:border-cyan-500/20",
        gradient: "from-sky-400 via-cyan-500 to-blue-600",
    },
    biology: {
        text: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-500/10",
        border: "border-teal-200 dark:border-teal-500/20",
        gradient: "from-sky-500 via-teal-500 to-cyan-600",
    },
};

export function getPriorityConfig(key: keyof typeof PRIORITY_CONFIG) {
    return PRIORITY_CONFIG[key];
}

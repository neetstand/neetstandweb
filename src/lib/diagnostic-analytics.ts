/**
 * Diagnostic Analytics Engine
 *
 * Takes raw diagnostic data and produces a comprehensive analytics object
 * including level estimation, reliability scoring, effort scoring,
 * subject breakdowns, and weak area identification.
 *
 * Effort Score Model (Robust):
 * - Attempt Rate (40%) — always valid
 * - Active Time (25%) — only if engagement exists
 * - Interaction Score (20%) — must exist
 * - Completion Behavior (15%) — pattern-based
 *
 * Key concepts:
 * - Adjusted accuracy removes 25% guessing baseline for MCQs with 4 options
 * - Level estimate maps to approximate NEET score ranges (never exact)
 * - Reliability measures how trustworthy the result is
 * - Effort score detects how seriously the student attempted
 */

// ─── Types ──────────────────────────────────────────────────────────────

export interface InteractionEvent {
    type: "option_select" | "option_change" | "question_navigate";
    timestamp: number;
    questionIndex: number;
    option?: string;
    previousOption?: string;
}

export interface DiagnosticRawData {
    totalQuestions: number;
    attemptedCount: number;
    correctCount: number;
    /** Subject -> { total, correct, attempted } */
    topicWisePerformance: Record<string, { total: number; correct: number; attempted?: number }>;
    /** Weak area topic IDs */
    weakAreas: string[];
    /** Chapter code -> chapter name mapping */
    chapterMap: Record<string, string>;
    /** Chapter code -> subject mapping */
    chapterSubjectMap: Record<string, string>;
    /** Time taken in seconds (null if unknown) */
    timeTakenSeconds: number | null;
    /** Total test duration in seconds */
    totalDurationSeconds: number;
    /** Interaction events from the test client */
    interactions: InteractionEvent[];
    /** Ordered answer letters matching question indices */
    answerLetters: string[];
    /** Subject -> Top chapters by weightage */
    topChaptersBySubject?: Record<string, { name: string; weightage: number }[]>;
    /** Number of attempts made by the user */
    attemptCount: number;
}

export interface SubjectAnalytics {
    name: string;
    total: number;
    attempted: number;
    correct: number;
    accuracy: number;
    adjustedAccuracy: number;
    attemptPct: number;
    level: "Strong" | "Moderate" | "Weak" | "Critical";
    color: "green" | "yellow" | "red";
    topChapters?: { name: string; weightage: number }[];
}

export interface WeakAreaItem {
    topicId: string;
    topicName: string;
    subject: string;
    total: number;
    correct: number;
    accuracy: number;
}

export interface LevelEstimate {
    min: number;
    max: number;
    label: string;
}

export interface ReliabilityResult {
    level: "High" | "Medium" | "Low";
    reasons: string[];
}

export interface EffortResult {
    score: number;
    label: string;
    insight: string;
    breakdown: {
        attemptScore: number;   // out of 40
        timeScore: number;      // out of 25
        interactionScore: number; // out of 20
        completionScore: number;  // out of 15
    };
    isEngaged: boolean;
    activeTimeSeconds: number;
}

export interface ConditionalUX {
    case: "high_score_low_effort" | "low_score_high_effort" | "low_score_low_effort" | "normal";
    headline: string;
    message: string;
}

export interface DiagnosticAnalytics {
    overall: {
        totalQuestions: number;
        attempted: number;
        correct: number;
        accuracy: number;
        attemptPct: number;
        adjustedAccuracy: number;
    };
    levelEstimate: LevelEstimate;
    reliability: ReliabilityResult;
    effort: EffortResult;
    subjects: SubjectAnalytics[];
    weakAreas: WeakAreaItem[];
    conditionalUX: ConditionalUX;
    whatIf: {
        additionalCorrect: number;
        newLevelEstimate: LevelEstimate;
    };
    direction: {
        priority: { subject: string; level: string; action: string }[];
    };
    /** Number of attempts made by the user */
    attemptCount: number;
    /** ID of the attempt being analyzed */
    attemptId?: string;
}

// ─── Constants ──────────────────────────────────────────────────────────

const GUESSING_BASELINE = 0.25; // 4-option MCQ
const NEET_TOTAL_MARKS = 720;

/** Idle gap threshold: gaps > 60 sec between actions are not counted as active time */
const IDLE_GAP_THRESHOLD_MS = 60_000;

/** Expected time per question in seconds (~30-45 sec) */
const EXPECTED_SECONDS_PER_QUESTION = 37.5;

/** Minimum interactions to be considered "engaged" */
const MIN_ENGAGED_ATTEMPTS = 3;

// Level ranges mapped from adjusted accuracy
const LEVEL_RANGES: { minAccuracy: number; maxAccuracy: number; min: number; max: number; label: string }[] = [
    { minAccuracy: 0.85, maxAccuracy: 1.0, min: 600, max: 680, label: "Advanced" },
    { minAccuracy: 0.70, maxAccuracy: 0.85, min: 525, max: 600, label: "Above Average" },
    { minAccuracy: 0.55, maxAccuracy: 0.70, min: 450, max: 525, label: "Average" },
    { minAccuracy: 0.40, maxAccuracy: 0.55, min: 360, max: 450, label: "Below Average" },
    { minAccuracy: 0.25, maxAccuracy: 0.40, min: 280, max: 360, label: "Needs Improvement" },
    { minAccuracy: 0.0, maxAccuracy: 0.25, min: 180, max: 280, label: "Foundation Level" },
];

// ─── Core Engine ────────────────────────────────────────────────────────

export function computeDiagnosticAnalytics(raw: DiagnosticRawData): DiagnosticAnalytics {
    // ── 1. Overall Stats ──
    const accuracy = raw.attemptedCount > 0
        ? raw.correctCount / raw.attemptedCount
        : 0;
    const attemptPct = raw.totalQuestions > 0
        ? raw.attemptedCount / raw.totalQuestions
        : 0;
    const overallAccuracyRaw = raw.totalQuestions > 0
        ? raw.correctCount / raw.totalQuestions
        : 0;

    // Adjusted accuracy: removes guessing bias
    // Formula: (observed - chance) / (1 - chance), floored at 0
    const adjustedAccuracy = Math.max(0, (overallAccuracyRaw - GUESSING_BASELINE) / (1 - GUESSING_BASELINE));

    const overall = {
        totalQuestions: raw.totalQuestions,
        attempted: raw.attemptedCount,
        correct: raw.correctCount,
        accuracy: Math.round(accuracy * 100),
        attemptPct: Math.round(attemptPct * 100),
        adjustedAccuracy: Math.round(adjustedAccuracy * 100),
    };

    // ── 2. Subject-wise Analytics ──
    const subjects = computeSubjectAnalytics(raw);

    // ── 3. Effort Score (NEW: robust model) ──
    const effort = computeEffortScore(raw);

    // ── 4. Reliability Score ──
    const reliability = computeReliability(raw, effort);

    // ── 5. Level Estimate ──
    const levelEstimate = computeLevelEstimate(adjustedAccuracy, reliability);

    // ── 6. Weak Areas ──
    const weakAreas = computeWeakAreas(raw);

    // ── 7. Conditional UX ──
    const conditionalUX = computeConditionalUX(adjustedAccuracy, effort);

    // ── 8. What-If Simulation ──
    const whatIf = computeWhatIf(raw, adjustedAccuracy);

    // ── 9. Direction / Priority ──
    const direction = computeDirection(subjects);

    return {
        overall,
        levelEstimate,
        reliability,
        effort,
        subjects,
        weakAreas,
        conditionalUX,
        whatIf,
        direction,
        attemptCount: raw.attemptCount,
    };
}

// ─── Subject Analytics ──────────────────────────────────────────────────

function computeSubjectAnalytics(raw: DiagnosticRawData): SubjectAnalytics[] {
    const subjectMap: Record<string, { total: number; correct: number; attempted: number }> = {};

    for (const [key, val] of Object.entries(raw.topicWisePerformance)) {
        const subject = key;
        if (!subjectMap[subject]) {
            subjectMap[subject] = { total: 0, correct: 0, attempted: 0 };
        }
        subjectMap[subject].total += val.total;
        subjectMap[subject].correct += val.correct;
        subjectMap[subject].attempted += (val.attempted ?? val.total);
    }

    return Object.entries(subjectMap).map(([name, stats]) => {
        const accuracy = stats.attempted > 0 ? stats.correct / stats.attempted : 0;
        const rawAccuracy = stats.total > 0 ? stats.correct / stats.total : 0;
        const adjustedAccuracy = Math.max(0, (rawAccuracy - GUESSING_BASELINE) / (1 - GUESSING_BASELINE));
        const attemptPct = stats.total > 0 ? stats.attempted / stats.total : 0;

        let level: SubjectAnalytics["level"];
        let color: SubjectAnalytics["color"];

        if (adjustedAccuracy >= 0.55) {
            level = "Strong";
            color = "green";
        } else if (adjustedAccuracy >= 0.35) {
            level = "Moderate";
            color = "yellow";
        } else if (adjustedAccuracy >= 0.15) {
            level = "Weak";
            color = "red";
        } else {
            level = "Critical";
            color = "red";
        }

        return {
            name,
            total: stats.total,
            attempted: stats.attempted,
            correct: stats.correct,
            accuracy: Math.round(accuracy * 100),
            adjustedAccuracy: Math.round(adjustedAccuracy * 100),
            attemptPct: Math.round(attemptPct * 100),
            level,
            color,
            topChapters: raw.topChaptersBySubject?.[name] || []
        };
    }).sort((a, b) => a.adjustedAccuracy - b.adjustedAccuracy);
}

// ─── EFFORT SCORE (ROBUST MODEL) ────────────────────────────────────────

function computeEffortScore(raw: DiagnosticRawData): EffortResult {
    const interactions = raw.interactions || [];
    const answerLetters = raw.answerLetters || [];

    // ── STEP 1: Detect "Engaged Attempt" ──
    const totalInteractions = interactions.length;
    const isEngaged = raw.attemptedCount >= MIN_ENGAGED_ATTEMPTS || totalInteractions >= MIN_ENGAGED_ATTEMPTS;

    // ── STEP 2: Compute Active Time ──
    const activeTimeMs = computeActiveTime(interactions);
    const activeTimeSeconds = Math.floor(activeTimeMs / 1000);
    const expectedTimeSeconds = raw.totalQuestions * EXPECTED_SECONDS_PER_QUESTION;

    // ── STEP 3: Component Calculations ──

    // A. Attempt Score (40%)
    const attemptRate = raw.totalQuestions > 0 ? raw.attemptedCount / raw.totalQuestions : 0;
    const attemptScore = Math.round(attemptRate * 40);

    // B. Active Time Score (25%) — only if engaged
    let timeScore = 0;
    if (isEngaged && expectedTimeSeconds > 0) {
        const normalizedTime = Math.min(1, activeTimeSeconds / expectedTimeSeconds);
        timeScore = Math.round(normalizedTime * 25);
    }

    // C. Interaction Score (20%) — measures engagement depth
    let interactionScore = 0;
    if (raw.totalQuestions > 0) {
        interactionScore = Math.round(
            Math.min(totalInteractions / raw.totalQuestions, 1) * 20
        );
    }

    // D. Completion Behavior (15%) — penalize suspicious patterns
    const completionScore = computeCompletionBehavior(raw, interactions, answerLetters);

    // ── STEP 4: Hard Guardrails ──
    let effortScore = attemptScore + timeScore + interactionScore + completionScore;

    // Case 1: No attempt
    if (raw.attemptedCount === 0) {
        effortScore = 0;
    }

    // Case 2: Very low engagement
    if (raw.attemptedCount < MIN_ENGAGED_ATTEMPTS && activeTimeSeconds < 120) {
        effortScore = Math.min(effortScore, 20);
    }

    // Case 3: Idle inflation prevention — if active time is < 30% of total elapsed time
    if (
        raw.timeTakenSeconds !== null &&
        raw.timeTakenSeconds > 0 &&
        activeTimeSeconds / raw.timeTakenSeconds < 0.3 &&
        isEngaged // only apply if they had interactions (to avoid double-penalty on no-attempt)
    ) {
        effortScore = Math.round(effortScore * 0.7);
    }

    // Not-engaged cap
    if (!isEngaged) {
        effortScore = Math.min(effortScore, 20);
    }

    effortScore = clamp(effortScore, 0, 100);

    // ── Labels ──
    let label: string;
    let insight: string;

    if (effortScore >= 80) {
        label = "Serious Attempt";
        insight = "You gave a serious attempt. This analysis reflects your true level.";
    } else if (effortScore >= 50) {
        label = "Moderate Effort";
        insight = "You can improve focus for a more accurate analysis. Some questions were left unanswered or rushed.";
    } else if (effortScore >= 20) {
        label = "Low Effort";
        insight = "This looks like a casual attempt. Your actual level may be significantly higher.";
    } else {
        label = "Invalid Attempt";
        insight = "No meaningful attempt detected. Please retake the test seriously for an accurate analysis.";
    }

    return {
        score: effortScore,
        label,
        insight,
        breakdown: {
            attemptScore,
            timeScore,
            interactionScore,
            completionScore,
        },
        isEngaged,
        activeTimeSeconds,
    };
}

/**
 * Compute Active Time from interaction events.
 * Only counts gaps between consecutive actions that are <= 60 seconds.
 * Idle gaps (> 60s) are excluded entirely.
 */
function computeActiveTime(interactions: InteractionEvent[]): number {
    if (interactions.length < 2) {
        // If 0-1 interactions, active time is essentially 0
        return interactions.length === 1 ? 5_000 : 0; // 5 seconds credit for 1 interaction
    }

    // Sort by timestamp
    const sorted = [...interactions].sort((a, b) => a.timestamp - b.timestamp);
    let activeMs = 0;

    for (let i = 1; i < sorted.length; i++) {
        const gap = sorted[i].timestamp - sorted[i - 1].timestamp;
        if (gap <= IDLE_GAP_THRESHOLD_MS) {
            activeMs += gap;
        }
        // Gaps > 60s are ignored (idle time)
    }

    return activeMs;
}

/**
 * Compute Completion Behavior score (0-15).
 * Detects and penalizes suspicious patterns:
 * - All answers in last 1-2 minutes (rush at end)
 * - Same option repeated (A,A,A,A…)
 * - Ultra-fast answering (<5 sec consistently)
 */
function computeCompletionBehavior(
    raw: DiagnosticRawData,
    interactions: InteractionEvent[],
    answerLetters: string[]
): number {
    // No answers = no answer quality to evaluate
    const nonEmpty = answerLetters.filter(a => a !== "");
    if (nonEmpty.length === 0) return 0;

    let score = 15; // Start with max, subtract penalties

    const optionSelects = interactions.filter(e => e.type === "option_select");

    // ── Penalty 1: Same option repeated ──
    // If more than 60% of non-empty answers are the same letter
    if (nonEmpty.length >= 5) {
        const letterCounts: Record<string, number> = {};
        for (const letter of nonEmpty) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        }
        const maxCount = Math.max(...Object.values(letterCounts));
        const repetitionRate = maxCount / nonEmpty.length;
        if (repetitionRate > 0.7) {
            score -= 8; // Heavy penalty for >70% same option
        } else if (repetitionRate > 0.5) {
            score -= 4; // Moderate penalty for >50% same option
        }
    }

    // ── Penalty 2: Ultra-fast answering ──
    // Check if most option select events happen within <5 seconds of each other
    if (optionSelects.length >= 5) {
        const sorted = [...optionSelects].sort((a, b) => a.timestamp - b.timestamp);
        let fastCount = 0;
        for (let i = 1; i < sorted.length; i++) {
            const gap = sorted[i].timestamp - sorted[i - 1].timestamp;
            if (gap < 5_000) { // <5 seconds
                fastCount++;
            }
        }
        const fastRate = fastCount / (sorted.length - 1);
        if (fastRate > 0.7) {
            score -= 6; // Heavy penalty: consistently under 5 sec
        } else if (fastRate > 0.4) {
            score -= 3; // Moderate penalty
        }
    }

    // ── Penalty 3: Rush at end ──
    // If >60% of option selects happen in the last 2 minutes of the session
    if (optionSelects.length >= 5 && raw.timeTakenSeconds !== null && raw.timeTakenSeconds > 0) {
        const sortedSelects = [...optionSelects].sort((a, b) => a.timestamp - b.timestamp);
        const sessionStartMs = sortedSelects[0].timestamp;
        const sessionEndMs = sessionStartMs + (raw.timeTakenSeconds * 1000);
        const lastTwoMinThreshold = sessionEndMs - 120_000; // 2 minutes before end

        const lateSelects = sortedSelects.filter(e => e.timestamp >= lastTwoMinThreshold);
        const lateRate = lateSelects.length / sortedSelects.length;
        if (lateRate > 0.6) {
            score -= 5; // Rushed at the end
        }
    }

    return Math.max(0, score);
}

// ─── Reliability ────────────────────────────────────────────────────────

function computeReliability(raw: DiagnosticRawData, effort: EffortResult): ReliabilityResult {
    const reasons: string[] = [];

    // Check attempt percentage
    const attemptPct = raw.totalQuestions > 0 ? raw.attemptedCount / raw.totalQuestions : 0;
    if (attemptPct < 0.5) {
        reasons.push("Less than 50% of questions were attempted");
    }

    // Check effort score
    if (effort.score < 40) {
        reasons.push("Low effort detected during the test");
    }

    // Check active time (from the new model, not raw total time)
    if (effort.isEngaged && effort.activeTimeSeconds < 120) {
        reasons.push("Active time spent was very short");
    }

    // Check if not engaged at all
    if (!effort.isEngaged) {
        reasons.push("No meaningful engagement detected");
    }

    // Check if accuracy is suspiciously close to random (25%)
    const rawAccuracy = raw.totalQuestions > 0 ? raw.correctCount / raw.totalQuestions : 0;
    if (raw.attemptedCount > 10 && Math.abs(rawAccuracy - 0.25) < 0.08) {
        reasons.push("Accuracy is close to random guessing level");
    }

    let level: ReliabilityResult["level"];
    if (reasons.length === 0) {
        level = "High";
    } else if (reasons.length <= 1) {
        level = "Medium";
    } else {
        level = "Low";
    }

    return { level, reasons };
}

// ─── Level Estimate ─────────────────────────────────────────────────────

function computeLevelEstimate(adjustedAccuracy: number, reliability: ReliabilityResult): LevelEstimate {
    const range = LEVEL_RANGES.find(r => adjustedAccuracy >= r.minAccuracy && adjustedAccuracy < r.maxAccuracy)
        || LEVEL_RANGES[LEVEL_RANGES.length - 1];

    let min = range.min;
    let max = range.max;

    if (reliability.level === "Low") {
        min = Math.max(180, min - 50);
        max = Math.min(NEET_TOTAL_MARKS, max + 50);
    } else if (reliability.level === "Medium") {
        min = Math.max(180, min - 25);
        max = Math.min(NEET_TOTAL_MARKS, max + 25);
    }

    return { min, max, label: range.label };
}

// ─── Weak Areas ─────────────────────────────────────────────────────────

function computeWeakAreas(raw: DiagnosticRawData): WeakAreaItem[] {
    return raw.weakAreas.map(topicId => {
        const perf = raw.topicWisePerformance[topicId];
        return {
            topicId,
            topicName: raw.chapterMap[topicId] || topicId,
            subject: raw.chapterSubjectMap[topicId] || "General",
            total: perf?.total || 0,
            correct: perf?.correct || 0,
            accuracy: perf && perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0,
        };
    }).sort((a, b) => a.accuracy - b.accuracy);
}

// ─── Conditional UX ─────────────────────────────────────────────────────

function computeConditionalUX(adjustedAccuracy: number, effort: EffortResult): ConditionalUX {
    const highScore = adjustedAccuracy >= 0.5;
    const highEffort = effort.score >= 60;

    if (highScore && !highEffort) {
        return {
            case: "high_score_low_effort",
            headline: "Strong Potential Detected",
            message: "You have strong potential but didn't attempt the test seriously. A focused retake could reveal an even higher level.",
        };
    }
    if (!highScore && highEffort) {
        return {
            case: "low_score_high_effort",
            headline: "Real Gaps Identified",
            message: "This reflects real gaps in your preparation. Focus on the weak areas below to see rapid improvement.",
        };
    }
    if (!highScore && !highEffort) {
        // Special case: effort=0-20 (invalid attempt)
        if (effort.score < 20) {
            return {
                case: "low_score_low_effort",
                headline: "No Meaningful Attempt Detected",
                message: "We couldn't assess your level — please retake the test seriously for an accurate analysis.",
            };
        }
        return {
            case: "low_score_low_effort",
            headline: "Your True Level May Be Higher",
            message: "Your actual level is likely higher than shown. Retake the test seriously for an accurate analysis.",
        };
    }
    return {
        case: "normal",
        headline: "Solid Performance",
        message: "Good attempt! Here's your detailed breakdown with clear next steps.",
    };
}

// ─── What-If Simulation ─────────────────────────────────────────────────

function computeWhatIf(raw: DiagnosticRawData, adjustedAccuracy: number): DiagnosticAnalytics["whatIf"] {
    const additionalCorrect = 5;
    const newCorrect = raw.correctCount + additionalCorrect;
    const newRawAccuracy = raw.totalQuestions > 0 ? newCorrect / raw.totalQuestions : 0;
    const newAdjusted = Math.max(0, (newRawAccuracy - GUESSING_BASELINE) / (1 - GUESSING_BASELINE));

    const newLevelEstimate = computeLevelEstimate(newAdjusted, { level: "Medium", reasons: [] });

    return {
        additionalCorrect,
        newLevelEstimate,
    };
}

// ─── Direction ──────────────────────────────────────────────────────────

function computeDirection(subjects: SubjectAnalytics[]): DiagnosticAnalytics["direction"] {
    const priority = subjects.map(s => {
        let action: string;
        if (s.level === "Critical") {
            action = `Strengthen ${s.name} fundamentals — start from NCERT basics`;
        } else if (s.level === "Weak") {
            action = `Focus on weak topics in ${s.name} — targeted practice needed`;
        } else if (s.level === "Moderate") {
            action = `Revise NCERT ${s.name} and practice previous year questions`;
        } else {
            action = `Maintain ${s.name} performance through regular practice`;
        }
        return { subject: s.name, level: s.level, action };
    });

    return { priority };
}

// ─── Utility ────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

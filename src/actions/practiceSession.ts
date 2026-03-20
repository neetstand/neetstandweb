"use server";

import { createClient } from "@/utils/supabase/server";
import renderWithDelimitersToString from "@/utils/KatexServerSideAutoRenderer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PracticeOption = {
    label: "A" | "B" | "C" | "D";
    option_id: string;
    option_text: string;       // rendered HTML
    is_correct: boolean;
    option_hint: string | null; // rendered HTML
    hint_image_url: string | null; // comma-joined resolved CDN URLs
};

export type ImageType = "none" | "single" | "multiple";

export type PracticeQuestion = {
    question_id: string;
    user_question_id: string;
    difficulty: "Easy" | "Medium" | "Hard";
    question_text: string;     // rendered HTML
    has_images: boolean;
    image_type: ImageType;
    images: string[];
    options: PracticeOption[];
    is_challenged?: boolean;
};

export type PreAnswer = {
    selected_option_id: string;
    is_correct: boolean;
};

export type PracticeSessionParams = {
    user_id: string;
    sub_chapter_code: string;
    subject: string;
    class_number: number;
    chapter_number: number;
    sub_chapter_no: number;
};

export type PracticeSessionResult =
    | { status: "success"; total_questions: number; questions: PracticeQuestion[] }
    | { status: "error"; message: string };

export type ExistingSessionResult =
    | {
        status: "found";
        total_questions: number;
        questions: PracticeQuestion[];
        // Map: user_question_id → pre-answer (only for already-answered questions)
        answers: Record<string, PreAnswer>;
    }
    | { status: "none" }
    | { status: "error"; message: string };

// ─── CDN URL Builder ──────────────────────────────────────────────────────────

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function buildCdnUrl(
    subject: string,
    classNumber: number,
    chapterNumber: number,
    subChapterNo: number,
    imageFileName: string
): string {
    return `https://cdn1.neetstand.com/${subject.toLowerCase()}/${classNumber}/${pad2(chapterNumber)}/${pad2(subChapterNo)}/${encodeURIComponent(imageFileName)}`;
}

function resolveImages(
    rawUrl: string | null | undefined,
    subject: string,
    classNumber: number,
    chapterNumber: number,
    subChapterNo: number
): string[] {
    if (!rawUrl || rawUrl.trim() === "") return [];
    return rawUrl
        .split(",")
        .map((f) => f.trim())
        .filter((f) => {
            if (!f) return false;
            const upper = f.toUpperCase();
            return upper !== "NULL" && upper !== "NA" && upper !== "N/A" && f !== "-";
        })
        .map((f) => {
            let fileName = f;
            // Forcefully append .png if it does not already end in a valid image extension
            const lower = fileName.toLowerCase();
            if (!lower.endsWith(".png") && !lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".svg") && !lower.endsWith(".gif")) {
                fileName += ".png";
            }
            if (fileName.startsWith("http://") || fileName.startsWith("https://")) return fileName;
            return buildCdnUrl(subject, classNumber, chapterNumber, subChapterNo, fileName);
        });
}

// ─── Shared helper: build PracticeOption[] from raw DB option rows ─────────────

function buildOptions(
    rawOptions: any[],
    subject: string,
    class_number: number,
    chapter_number: number,
    sub_chapter_no: number
): PracticeOption[] {
    const LABELS = ["A", "B", "C", "D"] as const;
    return rawOptions.map((opt, idx) => {
        const resolvedHintImages = resolveImages(
            opt.hint_image_url, subject, class_number, chapter_number, sub_chapter_no
        );
        if (resolvedHintImages.length > 0) {

        }
        return {
            label: LABELS[idx],
            option_id: opt.answer_id,
            option_text: renderWithDelimitersToString(opt.option_text),
            is_correct: opt.is_correct,
            option_hint: opt.option_hint ? renderWithDelimitersToString(opt.option_hint) : null,
            hint_image_url: resolvedHintImages.length > 0 ? resolvedHintImages.join(",") : null,
        };
    });
}

// ─── Shared helper: resolve sub_chapter_code → UUID ──────────────────────────

async function resolveSubChapterUUID(
    supabase: any,
    sub_chapter_code: string
): Promise<string | null> {
    const { data, error } = await supabase
        .from("sub_chapters")
        .select("id")
        .eq("sub_chapter_code", sub_chapter_code)
        .single();
    if (error || !data) return null;
    return data.id;
}

// ─── Load Existing Session ─────────────────────────────────────────────────────

export async function loadExistingPracticeSession(
    params: PracticeSessionParams
): Promise<ExistingSessionResult> {
    const { user_id, sub_chapter_code, subject, class_number, chapter_number, sub_chapter_no } = params;
    const supabase = await createClient();

    // 0. Resolve UUID
    const sub_chapter_uuid = await resolveSubChapterUUID(supabase, sub_chapter_code);
    if (!sub_chapter_uuid) return { status: "none" };

    // 1. Fetch existing user_questions for this user + sub_chapter
    const { data: uqRows, error: uqErr } = await supabase
        .from("user_questions")
        .select("*")
        .eq("user_id", user_id)
        .eq("sub_chapter_id", sub_chapter_uuid)
        .order("question_order", { ascending: true });

    if (uqErr || !uqRows || uqRows.length === 0) return { status: "none" };

    // 2. Reconstruct PracticeQuestion[] from existing rows
    const questions: PracticeQuestion[] = [];
    const answers: Record<string, PreAnswer> = {};

    for (const uq of uqRows) {
        // Fetch question
        const { data: q } = await supabase
            .from("questions")
            .select("*")
            .eq("question_id", uq.question_id)
            .single();
        if (!q) continue;

        // Fetch options
        const { data: rawOptions } = await supabase
            .from("options")
            .select("*")
            .eq("question_id", uq.question_id)
            .order("answer_id", { ascending: true })
            .limit(4);
        if (!rawOptions || rawOptions.length !== 4) continue;

        const options = buildOptions(rawOptions, subject, class_number, chapter_number, sub_chapter_no);

        const images = resolveImages(q.question_img_url, subject, class_number, chapter_number, sub_chapter_no);
        const imageType: ImageType = images.length === 0 ? "none" : images.length === 1 ? "single" : "multiple";

        questions.push({
            question_id: uq.question_id,
            user_question_id: uq.id,
            difficulty: uq.difficulty as "Easy" | "Medium" | "Hard",
            question_text: renderWithDelimitersToString(q.question_text),
            has_images: images.length > 0,
            image_type: imageType,
            images,
            options,
        });

        // Record pre-answer if this question was already answered
        if (uq.selected_option_id && uq.is_correct !== null) {
            answers[uq.id] = {
                selected_option_id: uq.selected_option_id,
                is_correct: uq.is_correct,
            };
        }
    }

    if (questions.length === 0) return { status: "none" };

    // Fetch challenge states for the loaded questions
    const questionIds = questions.map(q => q.question_id);
    const challengedSet = new Set<string>();

    if (questionIds.length > 0) {
        const { data: challenges } = await supabase
            .from("question_challenges")
            .select("question_id")
            .eq("user_id", user_id)
            .in("question_id", questionIds);

        if (challenges) {
            challenges.forEach(c => challengedSet.add(c.question_id));
        }

        questions.forEach(q => {
            q.is_challenged = challengedSet.has(q.question_id);
        });
    }

    return {
        status: "found",
        total_questions: questions.length,
        questions,
        answers,
    };
}

// ─── Generate New Session ─────────────────────────────────────────────────────

export async function generatePracticeSession(
    params: PracticeSessionParams
): Promise<PracticeSessionResult> {
    const { user_id, sub_chapter_code, subject, class_number, chapter_number, sub_chapter_no } = params;
    const supabase = await createClient();

    // 0. Resolve UUID
    const sub_chapter_uuid = await resolveSubChapterUUID(supabase, sub_chapter_code);
    if (!sub_chapter_uuid) {
        return { status: "error", message: `Sub-chapter not found for code "${sub_chapter_code}".` };
    }

    // 0b. Delete previous session is now handled inside the atomic stored procedure

    // 1. Fetch questions per difficulty
    const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
    const PER_BUCKET = 5;
    const FETCH_EXTRA = 15;

    const selectedQuestions: PracticeQuestion[] = [];

    for (const difficulty of DIFFICULTIES) {
        const { data: rawQuestions, error: qErr } = await supabase
            .from("questions")
            .select("*")
            .eq("sub_chapter_code", sub_chapter_code)
            .eq("question_use", "practice")
            .eq("difficulty_level", difficulty)
            .limit(FETCH_EXTRA);

        if (qErr) {
            return { status: "error", message: `Failed to fetch ${difficulty} questions: ${qErr.message}` };
        }

        const shuffled = (rawQuestions ?? []).sort(() => Math.random() - 0.5);
        let filled = 0;

        for (const q of shuffled) {
            if (filled >= PER_BUCKET) break;

            const { data: rawOptions, error: oErr } = await supabase
                .from("options")
                .select("*")
                .eq("question_id", q.question_id)
                .order("answer_id", { ascending: true })
                .limit(4);

            if (oErr || !rawOptions || rawOptions.length !== 4) continue;

            const options = buildOptions(rawOptions, subject, class_number, chapter_number, sub_chapter_no);

            const images = resolveImages(q.question_img_url, subject, class_number, chapter_number, sub_chapter_no);
            const imageType: ImageType = images.length === 0 ? "none" : images.length === 1 ? "single" : "multiple";

            selectedQuestions.push({
                question_id: q.question_id,
                user_question_id: "",
                difficulty,
                question_text: renderWithDelimitersToString(q.question_text),
                has_images: images.length > 0,
                image_type: imageType,
                images,
                options,
            });

            filled++;
        }

        if (filled < PER_BUCKET) {
            return {
                status: "error",
                message: `Insufficient ${difficulty} questions with exactly 4 options. Found ${filled} / ${PER_BUCKET} required.`,
            };
        }
    }

    // 2. Atomically wipe previous session and insert new user_questions via RPC
    const insertRows = selectedQuestions.map((q, idx) => {
        const correctOption = q.options.find((o) => o.is_correct);
        return {
            question_id: q.question_id,
            difficulty: q.difficulty,
            correct_option_id: correctOption?.option_id ?? null,
            question_order: idx + 1,
        };
    });

    const { data: insertedRows, error: insertErr } = await supabase.rpc("reset_practice_session", {
        p_user_id: user_id,
        p_sub_chapter_id: sub_chapter_uuid,
        p_questions: insertRows
    });

    if (insertErr) {
        return { status: "error", message: `Failed to record practice session: ${insertErr.message}` };
    }

    const idMap = new Map<string, string>();
    for (const row of insertedRows ?? []) {
        idMap.set(row.question_id, row.id);
    }

    const questionIds = selectedQuestions.map(q => q.question_id);
    const challengedSet = new Set<string>();

    if (questionIds.length > 0) {
        const { data: challenges } = await supabase
            .from("question_challenges")
            .select("question_id")
            .eq("user_id", user_id)
            .in("question_id", questionIds);

        if (challenges) {
            challenges.forEach(c => challengedSet.add(c.question_id));
        }
    }

    return {
        status: "success",
        total_questions: selectedQuestions.length,
        questions: selectedQuestions.map((q) => ({
            ...q,
            user_question_id: idMap.get(q.question_id) ?? "",
            is_challenged: challengedSet.has(q.question_id)
        })),
    };
}

// ─── Submit Answer ─────────────────────────────────────────────────────────────

export type SubmitAnswerResult =
    | { status: "success"; is_correct: boolean; correct_option_id: string }
    | { status: "error"; message: string };

export async function submitPracticeAnswer(
    user_question_id: string,
    selected_option_id: string,
    correct_option_id: string
): Promise<SubmitAnswerResult> {
    const supabase = await createClient();
    const is_correct = selected_option_id === correct_option_id;

    const { error } = await supabase
        .from("user_questions")
        .update({
            selected_option_id,
            is_correct
        })
        .eq("id", user_question_id);

    if (error) return { status: "error", message: error.message };

    return { status: "success", is_correct, correct_option_id };
}

// ─── Save Topic Progress ───────────────────────────────────────────────────────

export async function saveTopicProgress(
    user_id: string,
    sub_chapter_code: string,
    score: number
): Promise<{ status: "success" } | { status: "error"; message: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("user_chapter_progress")
        .upsert(
            {
                user_id,
                sub_chapter_code,
                score,
                is_completed: true,
                updated_at: new Date().toISOString()
            },
            { onConflict: "user_id, sub_chapter_code" }
        );

    if (error) {
        console.error("Error saving topic progress:", error);
        return { status: "error", message: error.message };
    }

    return { status: "success" };
}


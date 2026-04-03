"use server";

import { createClient } from "@/utils/supabase/server";
import renderWithDelimitersToString from "@/utils/KatexServerSideAutoRenderer";
import { PracticeQuestion, PracticeOption, ImageType } from "./practiceSession";

export type FlashTestParams = {
    targetDays: number[];
};

export type FlashPracticeQuestion = PracticeQuestion & { subject_name: string };

export type FlashTestResult =
    | { status: "success"; total_questions: number; questions: FlashPracticeQuestion[] }
    | { status: "error"; message: string };

// ─── Formatting helpers ────────────────────────────────────────────────────────
function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function buildCdnUrl(
    subject: string,
    chapterCode: string, // format like "04"
    imageFileName: string
): string {
    // We assume class is 11 or 12 based on the subject/chapter, but it's hard to infer perfectly without the chapter object. 
    // Fallback logic for CDN in flash tests where we might not have class_number easily:
    // If the image is a full URL it stays. If it needs resolution, we try to use a standard format or just return the fileName if it's already a path.
    return `https://cdn1.neetstand.com/${subject.toLowerCase()}/images/${encodeURIComponent(imageFileName)}`;
}

function resolveImages(
    rawUrl: string | null | undefined,
    subject: string,
    chapterCode: string
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
            const lower = fileName.toLowerCase();
            if (!lower.endsWith(".png") && !lower.endsWith(".jpg") && !lower.endsWith(".jpeg") && !lower.endsWith(".svg") && !lower.endsWith(".gif")) {
                fileName += ".png";
            }
            if (fileName.startsWith("http://") || fileName.startsWith("https://")) return fileName;
            return buildCdnUrl(subject, chapterCode, fileName);
        });
}

function buildOptions(
    rawOptions: any[],
    subject: string,
    chapterCode: string
): PracticeOption[] {
    const LABELS = ["A", "B", "C", "D"] as const;
    return rawOptions.map((opt, idx) => {
        const resolvedHintImages = resolveImages(opt.hint_image_url, subject, chapterCode);
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

// ─── Generate Flash Test Session ───────────────────────────────────────────────
export async function generateFlashTest(params: FlashTestParams): Promise<FlashTestResult> {
    const { targetDays } = params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { status: "error", message: "Not authenticated" };
    }

    // 1. Get user's active plan
    const { data: profile } = await supabase.from("profiles").select("active_sprint_plan_id").eq("id", user.id).single();
    if (!profile || !profile.active_sprint_plan_id) {
        return { status: "error", message: "User does not have an active sprint plan." };
    }

    // 2. Fetch the target days to get chapter codes
    const { data: daysData, error: daysErr } = await supabase
        .from("sprint_plan_days")
        .select("physics_chapter_code, chemistry_chapter_code, biology_chapter_code")
        .eq("plan_id", profile.active_sprint_plan_id)
        .in("day_number", targetDays);

    if (daysErr || !daysData || daysData.length === 0) {
        return { status: "error", message: "Failed to locate topics for the assigned days." };
    }

    // Aggregate chapter codes by subject
    const phyChapterCodes = new Set<string>();
    const chemChapterCodes = new Set<string>();
    const bioChapterCodes = new Set<string>();

    for (const d of daysData) {
        if (d.physics_chapter_code) phyChapterCodes.add(d.physics_chapter_code);
        if (d.chemistry_chapter_code) chemChapterCodes.add(d.chemistry_chapter_code);
        if (d.biology_chapter_code) bioChapterCodes.add(d.biology_chapter_code);
    }

    // 3. Helper to fetch random questions for a given subject and requirement count
    async function fetchQuestionsForSubject(subjectName: string, chapterCodes: string[], needed: number) {
        if (chapterCodes.length === 0 || needed === 0) return [];

        // Fetch valid sub-chapter codes mapped to these chapters
        const { data: subChapters } = await supabase
            .from("sub_chapters")
            .select("sub_chapter_code")
            .in("chapter_code", chapterCodes);

        const subCodes = (subChapters || []).map(sc => sc.sub_chapter_code);
        if (subCodes.length === 0) return [];

        // Fetch questions for these sub-chapters marked as 'practice'
        const { data: rawQuestions } = await supabase
            .from("questions")
            .select("*")
            .eq("question_use", "practice")
            .in("sub_chapter_code", subCodes)
            .limit(needed * 5); // fetch a pool to randomize

        if (!rawQuestions || rawQuestions.length === 0) return [];

        // Shuffle and pick
        const shuffled = rawQuestions.sort(() => Math.random() - 0.5);
        const selectedPool = shuffled.slice(0, needed);
        const resolvedQuestions: FlashPracticeQuestion[] = [];

        for (const q of selectedPool) {
            const { data: rawOptions } = await supabase
                .from("options")
                .select("*")
                .eq("question_id", q.question_id)
                .order("answer_id", { ascending: true })
                .limit(4);

            if (!rawOptions || rawOptions.length !== 4) continue;

            // Approximate chapterCode for CDN resolution
            const relatedChapter = chapterCodes[0] || "01"; 
            const options = buildOptions(rawOptions, subjectName, relatedChapter);
            const images = resolveImages(q.question_img_url, subjectName, relatedChapter);
            const imageType: ImageType = images.length === 0 ? "none" : images.length === 1 ? "single" : "multiple";

            resolvedQuestions.push({
                question_id: q.question_id,
                user_question_id: "", 
                difficulty: (q.difficulty_level || "Medium") as "Easy" | "Medium" | "Hard",
                question_text: renderWithDelimitersToString(q.question_text),
                has_images: images.length > 0,
                image_type: imageType,
                images,
                options,
                subject_name: subjectName.toLowerCase()
            });
        }

        return resolvedQuestions;
    }

    // 4. Fetch the exactly required quotas
    const bioQuestions = await fetchQuestionsForSubject("Biology", Array.from(bioChapterCodes), 5);
    const chemQuestions = await fetchQuestionsForSubject("Chemistry", Array.from(chemChapterCodes), 3);
    const phyQuestions = await fetchQuestionsForSubject("Physics", Array.from(phyChapterCodes), 2);

    const testQuestions = [...bioQuestions, ...chemQuestions, ...phyQuestions];

    if (testQuestions.length === 0) {
        return { status: "error", message: "Not enough practice questions found for the designated syllabus." };
    }

    return {
        status: "success",
        total_questions: testQuestions.length,
        questions: testQuestions,
    };
}

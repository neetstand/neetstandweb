"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CHALLENGE_ISSUE_TYPES } from "@/lib/constants/challenge-issue-types";

export async function submitQuestionChallenge(question_id: string, issue_type: string, user_comment: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { status: "error", message: "User not authenticated" };
    }

    const { error } = await supabase
        .from("question_challenges")
        .upsert({
            user_id: user.id,
            question_id: question_id,
            issue_type: issue_type,
            user_comment: user_comment,
            status: "Under Review",
        }, { onConflict: "user_id, question_id", ignoreDuplicates: true });

    if (error) {
        console.error("Error submitting question challenge:", error);
        return { status: "error", message: error.message };
    }

    revalidatePath("/profile/challenges");
    revalidatePath("/learn/[subject]/[topic]", "page");

    return { status: "success" };
}

export async function getUserChallenges() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { status: "error", message: "User not authenticated" };
    }

    // Join with questions, sub_chapters, and chapters using raw query or supabase joins
    const { data, error } = await supabase
        .from("question_challenges")
        .select(`
            id,
            status,
            sme_comment,
            issue_type,
            user_comment,
            created_at,
            question_id,
            questions!fk_question_challenges_questions (
                question_text,
                options (*),
                sub_chapters!questions_sub_chapter_code_sub_chapters_sub_chapter_code_fk (
                    sub_chapter_name,
                    chapters!sub_chapters_chapter_code_chapters_chapter_code_fk (
                        subject,
                        chapter_name
                    )
                )
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching challenges:", error);
        return { status: "error", message: error.message };
    }

    return { status: "success", data };
}

export async function getChallengeIssueTypes() {
    return { status: "success", data: [...CHALLENGE_ISSUE_TYPES] };
}

"use server";

import { createClient } from "@/utils/supabase/server";

export async function getChapterBySlug(slug: string) {
    const supabase = await createClient();

    const { data: chapters, error } = await supabase
        .from("chapters")
        .select(`
            *,
            sub_chapters!sub_chapters_chapter_code_chapters_chapter_code_fk(
                *,
                questions:questions(question_id)
            )
        `);

    if (error || !chapters) {
        console.error("Error fetching chapters by slug:", error);
        return null;
    }

    const slugify = (text: string) => {
        if (!text) return "";
        return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const matchedChapter = chapters.find(c => c.chapter_name && slugify(c.chapter_name) === slug);

    if (matchedChapter) {
        // Sort sub_chapters by order
        matchedChapter.sub_chapters.sort((a: any, b: any) => a.sub_chapter_order - b.sub_chapter_order);
    }

    return matchedChapter || null;
}

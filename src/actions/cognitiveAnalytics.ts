"use server";

import { createClient } from "@/utils/supabase/server";
import { 
    getGlobalCognitiveProfile, 
    getChapterCognitiveProfile,
    CognitiveScores,
    ChapterCognitiveProfile
} from "@/lib/cognitive-analytics";

export async function fetchGlobalCognitiveProfile(): Promise<CognitiveScores | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    try {
        const scores = await getGlobalCognitiveProfile(supabase, user.id);
        return scores;
    } catch (e) {
        console.error("Error fetching global cognitive profile:", e);
        return null;
    }
}

export async function fetchChapterCognitiveProfile(chapterCode: string): Promise<ChapterCognitiveProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    try {
        const profile = await getChapterCognitiveProfile(supabase, user.id, chapterCode);
        return profile;
    } catch (e) {
        console.error("Error fetching chapter cognitive profile:", e);
        return null;
    }
}

export async function fetchChapterCognitiveProfileByName(chapterName: string): Promise<ChapterCognitiveProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    try {
        const { data: chapters } = await supabase
            .from('chapters')
            .select('chapter_code')
            .ilike('chapter_name', chapterName)
            .limit(1);

        if (!chapters || chapters.length === 0) return null;

        return getChapterCognitiveProfile(supabase, user.id, chapters[0].chapter_code);
    } catch (e) {
        console.error("Error fetching chapter cognitive profile by name:", e);
        return null;
    }
}

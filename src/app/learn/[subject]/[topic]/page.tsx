import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TopicPageClient from "./TopicPageClient";
import DynamicTopicPageClient from "./DynamicTopicPageClient";
import { getChapterBySlug } from "@/actions/learnData";



interface PageProps {
    params: Promise<{ subject: string; topic: string }>;
}

export default async function TopicPage({ params }: PageProps) {
    const { subject, topic } = await params;

    // ─── Auth + Plan Access Guard ──────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    // Access is completely free for all subjects
    const allowedSubjects: string[] = ["physics", "chemistry", "biology"];

    // Attempt dynamic database fetch matching chapter slugs
    const chapterData = await getChapterBySlug(subject);

    // Normalize the subject param (could be "physics", "phy-mechanics" slug, etc.)
    let subjectKey = subject.startsWith("phy") ? "physics"
        : subject.startsWith("chem") ? "chemistry"
            : subject.startsWith("bio") ? "biology"
                : subject; // exact match fallback

    if (chapterData && chapterData.subject) {
        subjectKey = chapterData.subject.toLowerCase();
    }

    if (!allowedSubjects.includes(subjectKey)) {
        // Redirect to the dashboard with a query param so we can show an access-denied message
        return redirect(`/dashboard/ncert-to-neet-30-days?blocked=${encodeURIComponent(subjectKey)}`);
    }
    // ─────────────────────────────────────────────────────────────────────────────

    // Fetch killer player setting independently
    const { data: killerSettings } = await supabase
        .from("settings")
        .select("value")
        .eq("variable", "killer_player")
        .single();

    const killerPlayerEnabled = killerSettings?.value === "true";

    // Fetch user progress for these subchapters
    let completedSubChapterCodes: string[] = [];
    if (chapterData && chapterData.sub_chapters) {
        const subChapterCodesToLookUp = chapterData.sub_chapters.map((sc: any) => sc.sub_chapter_code);

        const { data: progress } = await supabase
            .from("user_chapter_progress")
            .select("sub_chapter_code")
            .eq("user_id", user.id)
            .eq("is_completed", true)
            .in("sub_chapter_code", subChapterCodesToLookUp);

        if (progress) {
            completedSubChapterCodes = progress.map(p => p.sub_chapter_code);
        }
    }

    if (chapterData) {
        return <DynamicTopicPageClient
            chapterData={chapterData}
            initialPart={topic}
            killerPlayerEnabled={killerPlayerEnabled}
            userId={user.id}
            completedSubChapterCodes={completedSubChapterCodes}
        />;
    }

    // Fallback to static mock datasets
    return <TopicPageClient subjectId={subject} topicId={topic} />;
}

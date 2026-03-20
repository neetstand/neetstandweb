import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StrengthClient from "./StrengthClient";

export default async function StrengthAnalysisServer() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    // Fetch all chapters ordered by class and chapter_number
    const { data: chaptersData, error } = await supabase
        .from("chapters")
        .select("subject, chapter_name, class, chapter_number")
        .order("class", { ascending: true })
        .order("chapter_number", { ascending: true });

    if (error) {
        console.error("Error fetching chapters for strength mapping:", error);
    } else {

    }

    // Process chapters into a record by subject
    const chaptersBySubject: Record<string, string[]> = {
        Physics: [],
        Chemistry: [],
        Biology: [],
    };

    if (chaptersData) {
        chaptersData.forEach(chapter => {
            if (chaptersBySubject[chapter.subject]) {
                chaptersBySubject[chapter.subject].push(chapter.chapter_name);
            }
        });
    }



    return <StrengthClient chaptersBySubject={chaptersBySubject} />;
}

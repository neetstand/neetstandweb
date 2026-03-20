import { createClient } from "@/utils/supabase/server";
import { getUserChallenges } from "@/actions/challenge";
import { redirect } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import renderWithDelimitersToString from "@/utils/KatexServerSideAutoRenderer";

export default async function UserChallengesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const challengesRes = await getUserChallenges();
    const challenges = challengesRes.data || [];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Accepted":
                return "default"; // or "success" if you have a custom badge variation
            case "Rejected":
                return "destructive";
            case "Under Review":
            default:
                return "secondary";
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-2">My Question Challenges</h1>
            <p className="text-gray-500 mb-8">
                Track the status of the questions you have reported to our Academic Team.
            </p>

            {challenges.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
                    <p className="text-muted-foreground text-lg mb-2">No challenges submitted yet.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {challenges.map((challenge: any) => {
                        const question = challenge.questions;
                        const subChapter = question?.sub_chapters;
                        const chapter = subChapter?.chapters;

                        return (
                            <AccordionItem
                                key={challenge.id}
                                value={challenge.id}
                                className="border rounded-lg px-4 bg-card"
                            >
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4 text-left gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold">
                                                {chapter?.subject} — {chapter?.chapter_name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {subChapter?.sub_chapter_name} • Reported on {format(new Date(challenge.created_at), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <div className="shrink-0 flex items-center">
                                            <Badge variant={getStatusVariant(challenge.status)}>
                                                {challenge.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 pb-6 border-t">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Question Content:</h4>
                                            <div
                                                className="bg-muted/50 p-4 rounded-md katex-rendered text-sm border"
                                                dangerouslySetInnerHTML={{
                                                    __html: question?.question_text ? renderWithDelimitersToString(question.question_text) : "No context available.",
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {question?.options?.map((opt: any) => (
                                                <div key={opt.answer_id} className={`p-3 rounded border text-sm ${opt.is_correct ? 'border-green-400 bg-green-50/50' : 'border-slate-200 bg-muted/20'}`}>
                                                    <div className="flex items-center mb-1">
                                                        <span className={`font-semibold text-xs ${opt.is_correct ? 'text-green-700' : 'text-slate-500'}`}>Option {opt.answer_id.slice(-1)} {opt.is_correct && "(Correct Answer)"}</span>
                                                    </div>
                                                    <div className="katex-rendered text-muted-foreground" dangerouslySetInnerHTML={{ __html: renderWithDelimitersToString(opt.option_text) }} />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-100 dark:border-amber-900/50 p-4">
                                            <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-2">My Reported Issue</h4>
                                            <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">{challenge.issue_type || "General Issue"}</p>
                                            {challenge.user_comment && (
                                                <p className="text-sm text-amber-800 dark:text-amber-200 mt-2 italic flex border-l-2 border-amber-300 dark:border-amber-700/50 pl-3">"{challenge.user_comment}"</p>
                                            )}
                                        </div>

                                        {challenge.sme_comment && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Academic Team Feedback:</h4>
                                                <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100 p-4 rounded-md text-sm border border-blue-100 dark:border-blue-900">
                                                    {challenge.sme_comment}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
}

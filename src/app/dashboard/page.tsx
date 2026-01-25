import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center justify-center p-4">
            <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3 p-10">
                <main className="flex-1 flex flex-col gap-6">
                    <h2 className="font-bold text-4xl mb-4">Dashboard</h2>
                    <p className="text-xl">
                        Welcome back, {user.email || user.phone}!
                    </p>
                    <div className="p-6 border rounded-lg bg-card/50">
                        <h3 className="font-semibold text-lg mb-2">My Progress</h3>
                        <p className="text-muted-foreground">You have no active tests currently.</p>
                    </div>

                    <div className="flex gap-4">
                        <Link href="/">
                            <Button variant="outline">Back to Home</Button>
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}

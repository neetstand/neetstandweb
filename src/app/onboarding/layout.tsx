import React, { Suspense } from "react";
import { HaloBackground } from "@/components/HaloBackground";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// The authentication and redirection logic is isolated to allow Suspense streaming
async function AuthGuard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_status, has_paid")
            .eq("id", user.id)
            .single();

        if (profile?.onboarding_status === "COMPLETED" && profile?.has_paid) {
            redirect("/dashboard");
        }
    }
    return null;
}

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen relative overflow-hidden bg-sky-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
            <HaloBackground />

            {/* Suspense boundary allows immediate streaming of the HaloBackground/Shell 
                while the auth cookies process asynchronously without blocking the route */}
            <Suspense fallback={null}>
                <AuthGuard />
            </Suspense>

            <div className="relative z-10 flex-1 flex flex-col">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-6 py-24 md:py-12 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </div>
        </main>
    );
}

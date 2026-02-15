"use client";

import { AuthCore } from "@/components/auth/AuthCore";
import { useRouter, useSearchParams } from "next/navigation";

import { WavyBackground } from "@/components/WavyBackground";
import { useTheme } from "next-themes";
import { useEffect, useState, Suspense } from "react";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");

    return (
        <AuthCore
            onSuccess={() => router.push("/dashboard")}
            isModal={false}
            initialStep={stepParam === "COLLECT_PHONE" ? "COLLECT_INFO" : undefined}
            prefilledEmail={emailParam || undefined}
        />
    );
}

export default function LoginPage() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <WavyBackground
            containerClassName={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'dark' : ''} text-sky-950 dark:text-slate-100`}
            colors={isDark ? ["#3b82f6", "#60a5fa", "#22d3ee", "#818cf8", "#2563eb"] : undefined}
            backgroundFill={isDark ? "#0b1121" : "#f0f9ff"}
            speed="slow"
            className="w-full flex items-center justify-center"
        >
            <div className="w-full max-w-[850px] h-[600px] md:h-[500px] relative z-10">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginContent />
                </Suspense>
            </div>
        </WavyBackground>
    );
}

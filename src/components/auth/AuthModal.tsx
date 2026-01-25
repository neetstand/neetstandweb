"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneAuthForm } from "./PhoneAuthForm";
import { EmailAuthForm } from "./EmailAuthForm";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export function AuthModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"phone" | "email">("phone");
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });
    };

    const resetView = () => {
        setView("phone");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => {
            setIsOpen(val);
            if (!val) setTimeout(resetView, 300); // Reset after animation
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[calc(100%-2rem)] max-w-[850px] p-0 overflow-hidden gap-0 flex flex-col md:flex-row h-[600px] md:h-[500px]">
                {/* Left Side - Visual/Branding */}
                <div className="hidden md:flex flex-col items-center justify-center w-5/12 bg-sky-50 dark:bg-slate-900 p-8 text-center border-r relative overflow-hidden">
                    {/* Background Halo/Backdrop */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[120%] h-[60%] bg-gradient-to-tr from-sky-200/40 via-blue-100/20 to-orange-100/30 blur-3xl rounded-full" />
                    </div>

                    <div className="relative w-72 h-24 mb-6 z-10 transition-transform hover:scale-105 duration-300">
                        <Image
                            src="/neetstand-light.png"
                            alt="NeetStand Logo"
                            fill
                            className="object-contain dark:hidden drop-shadow-sm"
                        />
                        <Image
                            src="/neetstand-dark.png"
                            alt="NeetStand Logo"
                            fill
                            className="object-contain hidden dark:block drop-shadow-sm"
                        />
                    </div>
                    <div className="z-10 font-bold text-xl mb-8 flex flex-row items-center gap-1 whitespace-nowrap">
                        <span className="text-blue-950 dark:text-blue-200">Pause .</span>
                        <span className="text-gray-500 dark:text-white">Identify .</span>
                        <span className="text-teal-600 dark:text-teal-400">Fix</span>
                    </div>

                    {/* Desktop Register Link */}
                    <div className="absolute bottom-8 left-0 w-full text-center z-10">
                        <p className="text-xs text-muted-foreground">
                            Don't have an account? <span className="font-bold cursor-pointer hover:underline text-teal-600">Start for Free</span>
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-background">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Login or Register</DialogTitle>
                        <DialogDescription>
                            Access your dashboard to start practicing
                        </DialogDescription>
                    </DialogHeader>

                    {/* Main Content */}
                    <div className="w-full max-w-sm mx-auto">
                        {view === "phone" && (
                            <>
                                <div className="mb-8 md:hidden text-center">
                                    <div className="relative w-48 h-12 mx-auto mb-4">
                                        <Image
                                            src="/neetstand-light.png"
                                            alt="NeetStand Logo"
                                            fill
                                            className="object-contain dark:hidden"
                                        />
                                        <Image
                                            src="/neetstand-dark.png"
                                            alt="NeetStand Logo"
                                            fill
                                            className="object-contain hidden dark:block"
                                        />
                                    </div>
                                    <div className="font-bold text-sm flex justify-center gap-1 whitespace-nowrap">
                                        <span className="text-blue-950 dark:text-blue-200">Pause .</span>
                                        <span className="text-gray-500 dark:text-white">Identify .</span>
                                        <span className="text-teal-600 dark:text-teal-400">Fix</span>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-[10px] text-muted-foreground">
                                            Don't have an account? <span className="font-bold cursor-pointer hover:underline text-teal-600">Start for Free</span>
                                        </p>
                                    </div>
                                </div>

                                <PhoneAuthForm onSuccess={() => setIsOpen(false)} />

                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-teal-200 dark:border-teal-800" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-teal-600 font-semibold">Or</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 hover:bg-sky-100 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 cursor-pointer transition-colors"
                                        onClick={handleGoogleLogin}
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Continue with Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 hover:bg-sky-100 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 cursor-pointer transition-colors"
                                        onClick={() => setView("email")}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                        Continue with Email
                                    </Button>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-[10px] text-teal-600 flex items-center justify-center gap-1 font-medium">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                        Safe and Secure
                                    </p>
                                </div>
                            </>
                        )}

                        {view === "email" && (
                            <EmailAuthForm
                                onSuccess={() => setIsOpen(false)}
                                onBack={() => setView("phone")}
                                onGoogleLogin={handleGoogleLogin}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

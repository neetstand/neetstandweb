"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { splitEmail } from "@/utils";

export function EmailAuthForm({ onSuccess, onBack, onGoogleLogin }: { onSuccess: () => void, onBack: () => void, onGoogleLogin: () => Promise<void> }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you might check if email exists.
        // For now, we just validate the format and show password field.
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setShowPassword(true);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { beforePlus, domain } = splitEmail(email);
        const sanitizedEmail = `${beforePlus}@${domain}`;

        const { error } = await supabase.auth.signInWithPassword({
            email: sanitizedEmail,
            password,
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        } else {
            toast.success("Logged in successfully!");
            onSuccess();
            window.location.href = "/dashboard";
        }
    };

    if (showPassword) {
        return (
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-semibold">Welcome Back</h3>
                    <p className="text-sm text-muted-foreground">
                        Enter password for {email}
                    </p>
                </div>
                <div className="space-y-2">
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-teal-600 hover:underline font-medium">
                            Forgot Password?
                        </button>
                    </div>
                </div>
                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowPassword(false)}
                    disabled={loading}
                >
                    Back
                </Button>
            </form>
        );
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleCheckEmail} className="space-y-4">
                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold">Email ID</h3>
                    <p className="text-sm text-muted-foreground">
                        Please enter your Email ID
                    </p>
                </div>
                <div className="relative">
                    <Input
                        type="email"
                        placeholder="Enter Email ID"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-12"
                        required
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none bg-teal-600 hover:bg-teal-700 text-white"
                        disabled={!email}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Button>
                </div>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full gap-2 hover:bg-sky-100 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 cursor-pointer transition-colors shadow-sm"
                    onClick={onGoogleLogin}
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
                    className="w-full gap-2 hover:bg-sky-100 hover:border-sky-300 dark:hover:bg-slate-800 dark:hover:border-slate-600 cursor-pointer transition-colors shadow-sm"
                    onClick={onBack}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Continue with Mobile
                </Button>
            </div>
            <div className="mt-6 text-center">
                <p className="text-[10px] text-teal-600 flex items-center justify-center gap-1 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                    Safe and Secure
                </p>
            </div>
        </div>
    );
}

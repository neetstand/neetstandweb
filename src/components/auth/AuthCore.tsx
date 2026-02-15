"use client";

import { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { CountrySelect } from "./CountrySelect";
import { checkUserStatus, sendCustomOtp, verifyCustomOtp, registerUser } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

interface AuthCoreProps {
    onSuccess?: () => void;
    isModal?: boolean;
    initialView?: "phone" | "email" | "register";
    initialStep?: AuthStep;
    prefilledEmail?: string;
}

type AuthStep = "INPUT" | "COLLECT_INFO" | "OTP_VERIFY";

function AuthCoreContent({ onSuccess, isModal = false, initialStep, prefilledEmail }: AuthCoreProps) {
    const router = useRouter();
    const supabase = createClient();

    // -- State --
    const [step, setStep] = useState<AuthStep>(initialStep || "INPUT");

    // Unified input state
    const [identifier, setIdentifier] = useState("");

    // For Collection Step
    const [phoneInput, setPhoneInput] = useState("");
    const [emailInput, setEmailInput] = useState(prefilledEmail || "");

    // Lock email if prefilled (coming from OAuth)
    const [isEmailVerified, setIsEmailVerified] = useState(!!prefilledEmail);


    // Country code for Phone
    const [country, setCountry] = useState("+91");

    const [isLoading, setIsLoading] = useState(false);

    // Store info needed for verification
    const [verificationInfo, setVerificationInfo] = useState<{
        identifier: string; // Phone or Email
        type: "sms" | "phone_change" | "email";
    } | null>(null);

    // Helper to determine type
    const isPhone = (val: string) => /^\d+$/.test(val);

    // Timer for resend
    const [timeLeft, setTimeLeft] = useState(60);

    // Effect for timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === "OTP_VERIFY" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timeLeft]);

    // Reset timer when step changes to OTP_VERIFY
    useEffect(() => {
        if (step === "OTP_VERIFY") {
            setTimeLeft(60);
        }
    }, [step]);


    // -- Handlers --

    const handleResendOtp = async () => {
        if (!verificationInfo) return;
        setIsLoading(true);
        try {
            if (verificationInfo.type === "phone_change") {
                const res = await registerUser(emailInput, verificationInfo.identifier);
                if (res.error) throw new Error(res.error);
                toast.success("Code resent successfully");
            } else {
                const isPhoneType = verificationInfo.type !== "email";
                const res = await sendCustomOtp(verificationInfo.identifier, isPhoneType);
                if (res.error) throw new Error(res.error);
                toast.success("Code resent successfully");
            }
            setTimeLeft(60);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to resend code";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!identifier) {
                toast.error("Please enter your details");
                setIsLoading(false);
                return;
            }

            const isPhoneInput = isPhone(identifier);
            let checkVal = identifier;

            if (isPhoneInput) {
                checkVal = `${country}${identifier}`;
            } else {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
                    toast.error("Invalid Email format");
                    setIsLoading(false);
                    return;
                }
            }

            // Check Status (This also sends OTP if user exists via signInWithOtp)
            const status = await checkUserStatus(checkVal, isPhoneInput);

            if (status.exists) {
                // OTP sent automatically by checkUserStatus (which calls signInWithOtp)
                // or user is logged in (session check).
                // If logged in, we might not need OTP?
                // checkUserStatus returns { exists: true }.
                // If they are logged in, effectively they are authenticated.
                // But this flow is "Login". If they are already logged in, why are they here?
                // Probably strictly checking input.

                // If we relied on signInWithOtp, OTP is sent.
                setVerificationInfo({
                    identifier: checkVal,
                    type: isPhoneInput ? "sms" : "email"
                });

                toast.success("OTP Sent");
                setStep("OTP_VERIFY");
            } else {
                // New User -> Collect Missing Info
                if (isPhoneInput) {
                    setPhoneInput(identifier); // Save what they typed
                    setEmailInput(""); // Clear email
                } else {
                    setEmailInput(identifier);
                    setPhoneInput("");
                }
                setStep("COLLECT_INFO");
            }

        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const finalPhone = `${country}${phoneInput}`;
            const finalEmail = emailInput;

            // Register and Send OTP
            // Custom registration logic: Create User -> Send OTP

            const res = await registerUser(finalEmail, finalPhone);
            if (res.error) {
                throw new Error(res.error || "Failed to update profile");
            }

            if (res.verifying) {
                setVerificationInfo({
                    identifier: finalPhone, // Usually verifying phone change or signup phone
                    type: res.verificationType || "sms"
                });
                toast.success(res.message || "OTP sent");
                setStep("OTP_VERIFY");
                return;
            }

            if (res.redirect || res.success) {
                toast.success("Profile updated!");
                router.refresh();
                router.push("/dashboard");
                return;
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Registration failed";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        setIsLoading(true);
        try {
            if (!verificationInfo) throw new Error("Missing verification info");

            let verifyParams;
            if (verificationInfo.type === 'email') {
                verifyParams = {
                    email: verificationInfo.identifier,
                    token: otp,
                    type: 'email' as const
                };
            } else {
                verifyParams = {
                    phone: verificationInfo.identifier,
                    token: otp,
                    type: verificationInfo.type as "sms" | "phone_change"
                };
            }

            const { error } = await supabase.auth.verifyOtp(verifyParams);

            if (error) {
                throw error;
            }

            toast.success("Login Successful");

            // Refresh session/router
            router.refresh(); // Update server components
            router.push("/dashboard");

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Invalid Code";
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
            },
        });
    };

    return (
        <div className={`w-full h-full flex flex-col md:flex-row p-0 overflow-hidden gap-0 ${isModal ? '' : 'rounded-3xl border shadow-[0_40px_70px_-15px_rgba(0,0,0,0.4)] dark:shadow-[0_0_40px_rgba(255,255,255,0.3)] bg-background dark:border-white'}`}>

            {/* Visual Side */}
            <div className="hidden md:flex flex-col items-center justify-center w-5/12 bg-sky-50 dark:bg-slate-900 p-8 text-center border-r relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[120%] h-[60%] bg-gradient-to-tr from-sky-200/40 via-blue-100/20 to-orange-100/30 blur-3xl rounded-full" />
                </div>
                <div className="relative w-72 h-24 mb-6 z-10 transition-transform hover:scale-105 duration-300">
                    <Image src="/neetstand-light.png" alt="NeetStand Logo" fill className="object-contain dark:hidden" />
                    <Image src="/neetstand-dark.png" alt="NeetStand Logo" fill className="object-contain hidden dark:block" />
                </div>
                <div className="z-10 font-bold text-xl mb-8 flex flex-row items-center gap-1 whitespace-nowrap">
                    <span className="text-sky-950 dark:text-blue-200">Pause .</span>
                    <span className="text-gray-500 dark:text-gray-200">Identify .</span>
                    <span className="text-teal-600 dark:text-teal-400">Fix</span>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center relative bg-background">
                <div className="w-full max-w-sm mx-auto space-y-6">

                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-sky-950 dark:text-white">
                            {step === "INPUT" && "Welcome"}
                            {step === "COLLECT_INFO" && "One Last Step"}
                            {step === "OTP_VERIFY" && "Enter Code"}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            {step === "INPUT" && "Enter Mobile or Email to continue"}
                            {step === "COLLECT_INFO" && "We need a bit more info to secure your account"}
                            {step === "OTP_VERIFY" && "Check your email for a verification code"}
                        </p>
                    </div>

                    {step === "INPUT" && (
                        <div className="space-y-4">
                            <form onSubmit={handleContinue} className="space-y-4" noValidate>
                                <div className="space-y-2">
                                    <Label>Mobile Number or Email</Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            {/* We detect input type automatically. 
                                                If it looks like number, we treat as phone.
                                                However, for phone we usually need Country Code.
                                                
                                                We can show Country Select ALWAYS? No, only if they type numbers?
                                                Or we can show it next to input if we detect numbers.
                                                
                                                Let's keep it simple: Just one input. 
                                                If they type numbers, we assume +91 unless they provide one?
                                                User prompt didn't specify dynamic UI for country.
                                                We'll assume country select is visible or we default to +91.
                                                
                                                Let's show country select if numeric value detected?
                                            */}
                                            <div className="flex gap-2">
                                                {/^\d+$/.test(identifier) && identifier.length > 0 && (
                                                    <CountrySelect value={country} onChange={setCountry} disabled={isLoading} />
                                                )}
                                                <Input
                                                    type="text"
                                                    placeholder="Enter mobile or email"
                                                    value={identifier}
                                                    onChange={(e) => setIdentifier(e.target.value)}
                                                    required
                                                    disabled={isLoading}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
                                </Button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                            </div>
                            <Button variant="outline" className="w-full gap-2 items-center justify-center font-medium transition-colors hover:bg-sky-50 dark:hover:bg-slate-800" onClick={handleGoogleLogin} disabled={isLoading}>
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>
                    )}

                    {step === "COLLECT_INFO" && (
                        <form onSubmit={handleRegister} className="space-y-4" noValidate>
                            {/* If we started with Email, we need Phone. If Mobile, we need Email. */}
                            {/* Just show both filled with what we have */}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        disabled={isEmailVerified || (identifier.includes("@") && isLoading)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Mobile Number</Label>
                                    <div className="flex gap-2">
                                        <CountrySelect value={country} onChange={setCountry} disabled={isLoading} />
                                        <Input
                                            type="tel"
                                            value={phoneInput}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value)) setPhoneInput(e.target.value);
                                            }}
                                            placeholder="Enter mobile number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : (isEmailVerified ? "Your Contact Phone Number" : "Verify & Login")}
                            </Button>
                            <Button type="button" variant="ghost" className="w-full" onClick={() => {
                                setIsEmailVerified(false);
                                setStep("INPUT");
                            }}>Back</Button>
                        </form>
                    )}


                    {step === "OTP_VERIFY" && (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="ENTER CODE"
                                className="text-center text-xl tracking-widest uppercase"
                                maxLength={6}
                                onChange={(e) => {
                                    if (e.target.value.length === 6) handleVerifyOtp(e.target.value);
                                }}
                            />

                            <div className="text-center text-sm">
                                {timeLeft > 0 ? (
                                    <span className="text-muted-foreground">
                                        Resend code in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </span>
                                ) : (
                                    <Button variant="link" className="p-0 h-auto text-sky-600 dark:text-sky-400" onClick={handleResendOtp} disabled={isLoading}>
                                        Resend Code
                                    </Button>
                                )}
                            </div>

                            <Button variant="ghost" className="w-full" onClick={() => setStep("INPUT")}>Cancel</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function AuthCore(props: AuthCoreProps) {
    return (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <AuthCoreContent {...props} />
        </Suspense>
    );
}

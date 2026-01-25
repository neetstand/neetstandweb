"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PhoneAuthForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation for 10 digit number
        if (!/^\d{10}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit mobile number");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({
            phone: `+91${phone}`,
        });

        if (error) {
            toast.error(error.message);
        } else {
            setShowOtp(true);
            toast.success("OTP sent successfully!");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.verifyOtp({
            phone: `+91${phone}`,
            token: otp,
            type: "sms",
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Logged in successfully!");
            onSuccess();
            router.push("/dashboard");
        }
        setLoading(false);
    };

    if (showOtp) {
        return (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-center">Verify OTP</h3>
                    <p className="text-sm text-center text-muted-foreground">
                        Enter the OTP sent to +91 {phone}
                    </p>
                </div>
                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-xs"
                    onClick={() => setShowOtp(false)}
                >
                    Change Number
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">Mobile Number</h3>
                <p className="text-sm text-muted-foreground">
                    Please enter your Mobile Number
                </p>
            </div>

            <div className="flex items-start gap-2">
                <div className="flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                    +91
                </div>
                <div className="flex-1">
                    <div className="relative">
                        <Input
                            type="tel"
                            placeholder="Enter Mobile Number"
                            value={phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 10) setPhone(val);
                            }}
                            className="pr-12"
                            required
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-0 top-0 h-full rounded-l-none"
                            disabled={loading || phone.length !== 10}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-[10px] font-medium text-red-500 dark:text-red-400 mt-1.5 ml-1">
                        For India numbers only (+91)
                    </p>
                </div>
            </div>
        </form>
    );
}

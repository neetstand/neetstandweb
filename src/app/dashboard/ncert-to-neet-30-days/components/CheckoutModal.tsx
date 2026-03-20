"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";

export function CheckoutModal({
    isOpen,
    onClose,
    plansData = [],
    initialPlan,
}: {
    isOpen: boolean;
    onClose: () => void;
    plansData?: any[];
    initialPlan?: "physics" | "chemistry" | "biology" | "sprint";
}) {
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const scrollableRef = useRef<HTMLDivElement>(null);
    const physicsRef = useRef<HTMLDivElement>(null);
    const chemistryRef = useRef<HTMLDivElement>(null);
    const biologyRef = useRef<HTMLDivElement>(null);
    const sprintRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Scroll to the right plan section when modal opens
    useEffect(() => {
        if (!isOpen || !initialPlan) return;
        const refMap = { physics: physicsRef, chemistry: chemistryRef, biology: biologyRef, sprint: sprintRef };
        const target = refMap[initialPlan]?.current;
        if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        }
    }, [isOpen, initialPlan]);

    const handleCheckout = async (planName: string, amount: number) => {
        const plan = plansData.find((p) => p.plan_name === planName);
        const planId = plan?.id;
        const planPricingId = plan?.plan_pricing?.[0]?.id;

        if (!planId || !planPricingId) {
            toast.error("Plan not found. Please try again later.");
            return;
        }

        setIsProcessing(planName);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, planName, planId, planPricingId })
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "NEETStand",
                description: planName,
                order_id: data.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch('/api/payment-verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            planName,
                            planId,
                            planPricingId
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        toast.success("Payment successful! Your plan is activated.");
                        window.location.href = "/dashboard";
                    } else {
                        toast.error(verifyData.error || "Payment verification failed.");
                    }
                },
                theme: { color: "#0ea5e9" }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                toast.error("Payment failed: " + response.error.description);
            });
            rzp1.open();

        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to initiate checkout");
        } finally {
            setIsProcessing(null);
        }
    };

    const getPlanPrice = (planName: string, fallbackPrice: number, isMrp = false) => {
        const plan = plansData?.find((p) => p.plan_name === planName);
        if (!plan || !plan.plan_pricing || plan.plan_pricing.length === 0) return fallbackPrice;
        const pricing = plan.plan_pricing[0];
        return isMrp ? pricing.mrp_price : pricing.offer_price;
    };

    if (!mounted) return null;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md">
            <div className="sr-only">Checkout Plans Offer</div>

            {/* Fixed close button — always visible, never scrolls */}
            <button
                onClick={onClose}
                className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[10000] bg-slate-800/80 hover:bg-slate-700/80 text-white p-3 rounded-full transition-colors backdrop-blur-xl border border-slate-600 shadow-xl"
            >
                <X size={24} />
            </button>

            {/* Scrollable content — full viewport height */}
            <div ref={scrollableRef} className="w-full h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                <div className="w-full flex justify-center py-10 sm:py-16 px-4">
                    <div className="w-full max-w-6xl flex flex-col items-center">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
                                Unlock Your Dashboard
                            </h1>
                            <p className="text-lg md:text-xl text-sky-200 opacity-90 font-medium max-w-2xl mx-auto shadow-sm">
                                Choose the plan that fits your weak areas to get unlimited access to the 30-Day Sprint and start mastering NEET today.
                            </p>
                        </div>

                        {/* ======================= PRICING ========================= */}
                        <div className="flex flex-col gap-10 w-full text-left">

                            {/* 30 Day Sprint Plan (Bundle) - Highlighted at top */}
                            <div ref={sprintRef} className="w-full max-w-4xl mx-auto">
                                <div className="bg-slate-900/80 border border-emerald-500/50 shadow-2xl shadow-emerald-900/50 rounded-3xl p-6 sm:p-10 flex flex-col relative transform hover:-translate-y-1 transition-transform duration-300">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-6 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/30 whitespace-nowrap">
                                        Best Value Bundle
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 mt-2">
                                        <div className="max-w-md">
                                            <h3 className="text-3xl md:text-4xl font-extrabold mb-3 text-emerald-400 drop-shadow-sm">30 Day Sprint</h3>
                                            <p className="text-slate-300 text-base leading-relaxed font-medium">
                                                The ultimate bundle. Master Physics, Chemistry, and Biology combined in a hyper-focused 30 day track.
                                            </p>
                                        </div>
                                        <div className="flex flex-col md:items-end bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-5xl md:text-6xl font-black text-white drop-shadow-md">₹{getPlanPrice("30 Day Sprint Plan", 1999)}</span>
                                                <span className="text-xl font-medium text-slate-400 line-through">₹{getPlanPrice("30 Day Sprint Plan", 3000, true)}</span>
                                            </div>
                                            <span className="text-emerald-400 text-sm font-semibold mt-2 uppercase tracking-wide">Valid for 45 Days • One time payment</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/40 rounded-2xl p-6 mb-10 border border-slate-700/50">
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 text-base">
                                            {['All 3 Subjects Included', 'Daily Flash Tests', 'Weekly Full Mocks', 'Smart Revision Plan'].map((f, i) => (
                                                <li key={i} className="flex items-center font-medium text-slate-200">
                                                    <div className="bg-emerald-500/20 p-1 rounded-full mr-4 flex-shrink-0">
                                                        <CheckCircle2 className="text-emerald-400" size={20} />
                                                    </div>
                                                    <span className="tracking-wide">{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button onClick={() => handleCheckout("30 Day Sprint Plan", getPlanPrice("30 Day Sprint Plan", 1999))} disabled={!!isProcessing} className="block text-center w-full py-5 rounded-xl font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/25 active:scale-[0.98] border border-emerald-400/50">
                                        {isProcessing === "30 Day Sprint Plan" ? "Processing..." : "Get Full Access Now"}
                                    </button>
                                </div>
                            </div>

                            {/* Separator / OR */}
                            <div className="relative flex items-center justify-center mt-2 mb-6 opacity-80 py-4 w-full max-w-5xl mx-auto flex-col">
                                <div className="absolute inset-x-1/4 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent top-1/2"></div>
                                <span className="relative bg-slate-900 px-6 py-1 rounded-full text-sm font-semibold text-slate-300 uppercase tracking-widest border border-slate-700/50">Or choose individual subjects</span>
                                <p className="mt-4 text-[13px] text-slate-400 font-medium text-center z-10 px-4 max-w-2xl bg-slate-900/80 rounded-full py-1">
                                    <span className="text-emerald-400">*</span> The Physics, Chemistry, and Biology plans are individual subject breakdowns of the complete 30-Day Sprint Plan.
                                </p>
                            </div>

                            {/* Individual Subjects - Bottom Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                                {/* Physics */}
                                <div ref={physicsRef} className="bg-slate-900/80 border border-sky-400/30 shadow-xl shadow-sky-900/20 rounded-2xl p-6 sm:p-8 flex flex-col hover:border-sky-400/60 transition-colors">
                                    <h3 className="text-2xl font-bold mb-3 text-white">30 Day Physics</h3>
                                    <p className="text-slate-300 mb-8 text-sm flex-grow leading-relaxed font-medium">Master Mechanics, Electromagnetism & Modern Physics.</p>
                                    <div className="mb-8 flex items-baseline gap-3">
                                        <span className="text-4xl font-extrabold text-sky-400">₹{getPlanPrice("30 Day Physics Sprint Plan", 899)}</span>
                                        <span className="text-lg font-medium text-slate-500 line-through">₹{getPlanPrice("30 Day Physics Sprint Plan", 1200, true)}</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 text-sm text-slate-200 font-medium">
                                        {['Physics concepts only', 'Chapter-wise tracking', 'Error log features'].map((f, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="bg-sky-500/20 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="text-sky-400" size={14} />
                                                </div>
                                                <span className="tracking-wide leading-tight">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="block mb-4 text-center text-xs text-sky-400/80 uppercase tracking-wider font-semibold">Valid for 45 Days</span>
                                    <button onClick={() => handleCheckout("30 Day Physics", getPlanPrice("30 Day Physics Sprint Plan", 899))} disabled={!!isProcessing} className="block text-center w-full py-4 rounded-xl font-bold text-lg bg-sky-900/50 text-sky-300 hover:bg-sky-800/60 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-auto border border-sky-400/30">
                                        {isProcessing === "30 Day Physics" ? "Processing..." : "Select Physics"}
                                    </button>
                                </div>

                                {/* Chemistry */}
                                <div ref={chemistryRef} className="bg-slate-900/80 border border-purple-400/30 shadow-xl shadow-purple-900/20 rounded-2xl p-6 sm:p-8 flex flex-col hover:border-purple-400/60 transition-colors">
                                    <h3 className="text-2xl font-bold mb-3 text-white">30 Day Chemistry</h3>
                                    <p className="text-slate-300 mb-8 text-sm flex-grow leading-relaxed font-medium">Conquer Physical, Organic & Inorganic Chemistry.</p>
                                    <div className="mb-8 flex items-baseline gap-3">
                                        <span className="text-4xl font-extrabold text-purple-400">₹{getPlanPrice("30 Day Chemistry Sprint Plan", 899)}</span>
                                        <span className="text-lg font-medium text-slate-500 line-through">₹{getPlanPrice("30 Day Chemistry Sprint Plan", 1200, true)}</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 text-sm text-slate-200 font-medium">
                                        {['Chemistry concepts only', 'NCERT-mapped questions', 'Reaction summaries'].map((f, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="bg-purple-500/20 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="text-purple-400" size={14} />
                                                </div>
                                                <span className="tracking-wide leading-tight">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="block mb-4 text-center text-xs text-purple-400/80 uppercase tracking-wider font-semibold">Valid for 45 Days</span>
                                    <button onClick={() => handleCheckout("30 Day Chemistry", getPlanPrice("30 Day Chemistry Sprint Plan", 899))} disabled={!!isProcessing} className="block text-center w-full py-4 rounded-xl font-bold text-lg bg-purple-900/50 text-purple-300 hover:bg-purple-800/60 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-auto border border-purple-400/30">
                                        {isProcessing === "30 Day Chemistry" ? "Processing..." : "Select Chemistry"}
                                    </button>
                                </div>

                                {/* Biology */}
                                <div ref={biologyRef} className="bg-slate-900/80 border border-rose-400/30 shadow-xl shadow-rose-900/20 rounded-2xl p-6 sm:p-8 flex flex-col hover:border-rose-400/60 transition-colors">
                                    <h3 className="text-2xl font-bold mb-3 text-white">30 Day Biology</h3>
                                    <p className="text-slate-300 mb-8 text-sm flex-grow leading-relaxed font-medium">Dominate Botany & Zoology with pure NCERT focus.</p>
                                    <div className="mb-8 flex items-baseline gap-3">
                                        <span className="text-4xl font-extrabold text-rose-400">₹{getPlanPrice("30 Day Biology Sprint Plan", 899)}</span>
                                        <span className="text-lg font-medium text-slate-500 line-through">₹{getPlanPrice("30 Day Biology Sprint Plan", 1200, true)}</span>
                                    </div>
                                    <ul className="space-y-4 mb-10 text-sm text-slate-200 font-medium">
                                        {['Biology concepts only', 'High-weightage focus', 'Line-by-line NCERT'].map((f, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="bg-rose-500/20 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="text-rose-400" size={14} />
                                                </div>
                                                <span className="tracking-wide leading-tight">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="block mb-4 text-center text-xs text-rose-400/80 uppercase tracking-wider font-semibold">Valid for 45 Days</span>
                                    <button onClick={() => handleCheckout("30 Day Biology", getPlanPrice("30 Day Biology Sprint Plan", 899))} disabled={!!isProcessing} className="block text-center w-full py-4 rounded-xl font-bold text-lg bg-rose-900/50 text-rose-300 hover:bg-rose-800/60 disabled:opacity-70 disabled:cursor-not-allowed transition-colors mt-auto border border-rose-400/30">
                                        {isProcessing === "30 Day Biology" ? "Processing..." : "Select Biology"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

import { createClient } from "@/utils/supabase/server";
import { HeroClient } from "./HeroClient";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, ArrowUp, Target, BookOpen, TrendingUp } from 'lucide-react';
import { FadeIn } from "./FadeIn"; // Assuming FadeIn is in the same directory

export const Hero = async () => {
    const supabase = await createClient();
    // Fetch pricing data dynamically
    const { data: plansData, error: plansError } = await supabase.from('plans').select('*, plan_pricing(*)');

    const plans = plansData || [];

    const getPrice = (name: string, isMrp = false) => {
        const p = plans.find((x: any) => x.plan_name === name);
        if (!p || !p.plan_pricing || p.plan_pricing.length === 0) return 0;
        const pricing = p.plan_pricing[0];
        return isMrp ? pricing.mrp_price : pricing.offer_price;
    };

    return (
        <HeroClient>
            {/* Problem */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Why most NEET aspirants feel stuck</h2>
                    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                        <p className="text-lg mb-6">
                            Most students practice blindly — they solve questions without knowing why they keep losing marks.
                        </p>
                        <div className="bg-sky-200 dark:bg-slate-800 p-6 rounded-lg">
                            <p className="text-lg">
                                More questions won’t raise your NEET score — <strong className="text-emerald-600">correcting the right mistakes will.</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Features */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">At NeetStand, you get:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {[
                            'A diagnostic-first score gap analysis',
                            'Mistake-based revision plan, not random MCQs',
                            'NCERT-aligned explanations tied to your weak areas',
                            'Structured timeline that fits March–May revision',
                            'Weekly mock tests + focused fix packs'
                        ].map((f, i) => (
                            <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8" key={i}>
                                <CheckCircle className="text-emerald-600 mb-3" size={32} />
                                <h3 className="text-xl font-semibold">{f}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-lg">
                        <p>No unnecessary difficulty. No syllabus noise.</p>
                        <p className="font-bold text-emerald-600">Only what NEET actually tests.</p>
                    </div>
                </div>
            </FadeIn>

            {/* How It Works */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { num: 1, icon: Target, title: 'Diagnose', desc: 'Take a free full-length diagnostic test to uncover weak chapters and repeated errors.' },
                            { num: 2, icon: BookOpen, title: 'Practice Smart', desc: 'Get targeted practice and fixes selected based on your mistakes, not by topic volume.' },
                            { num: 3, icon: ArrowUp, title: 'Improve Fast', desc: 'Know exactly what to revise next, where marks leak, and what mock to take.' }
                        ].map((s, index) => {
                            const Icon = s.icon;
                            return (
                                <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8 text-center" key={s.num}>
                                    <div className="inline-flex w-16 h-16 bg-emerald-600 text-white rounded-full items-center justify-center text-2xl font-bold mb-4">{s.num}</div>
                                    <Icon className="mx-auto mb-4 text-emerald-600" size={48} />
                                    <h3 className="text-xl font-semibold mb-4">{s.title}</h3>
                                    <p className="text-sky-800 dark:text-slate-400 mb-4">{s.desc}</p>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </FadeIn>

            {/* Insight */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Insight you’ll see after a test:</h2>
                    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 border-l-4 border-l-orange-600 rounded-xl p-8">
                        <div className="flex gap-4">
                            <TrendingUp className="text-orange-600 flex-shrink-0" size={32} />
                            <div>
                                <p className="text-lg mb-4 italic">
                                    “You lost marks due to conceptual confusion between similar terms in Biology. Revise NCERT Chapter XX (paragraph 3–4), then retry related questions.”
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Who For */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">Who NEETStand Is For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                            <h3 className="text-2xl mb-6 font-bold text-emerald-600 flex items-center">
                                <CheckCircle className="mr-3" size={32} />Ideal for:
                            </h3>
                            {['Final-phase NEET 2026 aspirants', 'Repeaters looking for a last score jump', 'Students tired of random MCQ practice'].map((t, i) => (
                                <div key={i} className="flex mb-4 items-center">
                                    <CheckCircle className="text-emerald-600 mr-3 flex-shrink-0" size={20} />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                            <h3 className="text-2xl mb-6 font-bold text-orange-600 flex items-center">
                                <XCircle className="mr-3" size={32} />Not for:
                            </h3>
                            {['Casual browsing', 'Feature-only platforms without clear fix plans'].map((t, i) => (
                                <div key={i} className="flex mb-4 items-center">
                                    <XCircle className="text-orange-600 mr-3 flex-shrink-0" size={20} />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Pricing */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div id="pricing" className="max-w-7xl mx-auto px-6"> {/* Moved id="pricing" to an inner block so link anchors properly work inside FadeIn's section. */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Pricing</h2>
                        <p className="text-xl">Choose the plan that fits your weak areas.</p>
                    </div>
                    <div className="flex flex-col gap-10 max-w-6xl mx-auto text-left">
                        {/* 30 Day Sprint Plan (Bundle) - Highlighted at top */}
                        <div className="w-full max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-slate-700 border-2 border-emerald-500 shadow-xl dark:shadow-emerald-900/20 rounded-2xl p-6 sm:p-8 flex flex-col relative transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider whitespace-nowrap shadow-md">Best Value Bundle</div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
                                    <div className="max-w-md">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-600 dark:text-emerald-400">30 Day Sprint</h3>
                                        <p className="text-sky-800 dark:text-slate-400 text-base leading-relaxed">The ultimate bundle. Master Physics, Chemistry, and Biology combined in a hyper-focused 30 day track.</p>
                                    </div>
                                    <div className="flex flex-col md:items-end">
                                        <div className="flex items-baseline gap-2 md:gap-3">
                                            <span className="text-4xl md:text-5xl font-extrabold text-emerald-600">₹{getPrice("30 Day Sprint Plan")}</span>
                                            <span className="text-xl font-medium text-sky-800/60 dark:text-slate-400/60 line-through">₹{getPrice("30 Day Sprint Plan", true)}</span>
                                        </div>
                                        <span className="text-emerald-500 font-semibold text-sm mt-2 block uppercase tracking-wider">Valid for 45 Days • One time payment</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-5 mb-8">
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                                        {['All 3 Subjects Included', 'Daily Flash Tests', 'Weekly Full Mocks', 'Smart Revision Plan'].map((f, i) => (
                                            <li key={i} className="flex items-center font-medium bg-transparent text-emerald-950 dark:text-emerald-100">
                                                <CheckCircle className="text-emerald-500 mr-3 flex-shrink-0" size={20} />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Link href="/login" className="block text-center w-full py-4 rounded-xl font-bold text-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-auto border border-emerald-500">Get Full Access</Link>
                            </div>
                        </div>

                        {/* Separator / OR */}
                        <div className="relative flex items-center justify-center mt-2 mb-8 opacity-60 flex-col">
                            <div className="absolute inset-x-1/4 h-px bg-gradient-to-r from-transparent via-sky-300 dark:via-slate-600 to-transparent top-1/2"></div>
                            <span className="relative bg-[#f0f9ff] dark:bg-[#0b1121] px-4 text-sm font-semibold text-sky-800 dark:text-slate-400 uppercase tracking-widest z-10">Or choose individual subjects</span>
                            <p className="mt-4 text-[13px] text-sky-700 dark:text-slate-500 font-medium text-center px-4 max-w-2xl">
                                <span className="text-emerald-500 px-1 font-bold">*</span> The Physics, Chemistry, and Biology plans are individual subject <br className="hidden sm:block" />breakdowns of the complete 30-Day Sprint Plan.
                            </p>
                        </div>

                        {/* Individual Subjects - Bottom Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
                            {/* Physics */}
                            <div className="bg-white dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl p-6 flex flex-col hover:border-sky-300 dark:hover:border-slate-500 transition-colors">
                                <h3 className="text-xl font-bold mb-2 text-sky-950 dark:text-white">30 Day Physics</h3>
                                <p className="text-sky-800 dark:text-slate-400 mb-6 text-sm flex-grow">Master Mechanics, Electromagnetism & Modern Physics.</p>
                                <div className="mb-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">₹{getPrice("30 Day Physics")}</span>
                                    <span className="text-sm font-medium text-sky-800/60 dark:text-slate-400/60 line-through">₹{getPrice("30 Day Physics", true)}</span>
                                </div>
                                <span className="block mb-4 text-xs font-semibold text-sky-600/80 dark:text-sky-400/80 uppercase tracking-wider">Valid for 45 Days</span>
                                <ul className="space-y-3 mb-8 text-sm text-sky-900 dark:text-slate-300">
                                    {['Physics concepts only', 'Chapter-wise tracking', 'Error log features'].map((f, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="text-sky-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/login" className="block text-center w-full py-2.5 rounded-lg font-semibold bg-sky-50 dark:bg-slate-700/50 text-sky-900 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors mt-auto border border-sky-100 dark:border-slate-600">Select Physics</Link>
                            </div>

                            {/* Chemistry */}
                            <div className="bg-white dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl p-6 flex flex-col hover:border-sky-300 dark:hover:border-slate-500 transition-colors">
                                <h3 className="text-xl font-bold mb-2 text-sky-950 dark:text-white">30 Day Chemistry</h3>
                                <p className="text-sky-800 dark:text-slate-400 mb-6 text-sm flex-grow">Conquer Physical, Organic & Inorganic Chemistry.</p>
                                <div className="mb-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">₹{getPrice("30 Day Chemistry")}</span>
                                    <span className="text-sm font-medium text-sky-800/60 dark:text-slate-400/60 line-through">₹{getPrice("30 Day Chemistry", true)}</span>
                                </div>
                                <span className="block mb-4 text-xs font-semibold text-purple-600/80 dark:text-purple-400/80 uppercase tracking-wider">Valid for 45 Days</span>
                                <ul className="space-y-3 mb-8 text-sm text-sky-900 dark:text-slate-300">
                                    {['Chemistry concepts only', 'NCERT-mapped questions', 'Reaction summaries'].map((f, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="text-sky-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/login" className="block text-center w-full py-2.5 rounded-lg font-semibold bg-sky-50 dark:bg-slate-700/50 text-sky-900 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors mt-auto border border-sky-100 dark:border-slate-600">Select Chemistry</Link>
                            </div>

                            {/* Biology */}
                            <div className="bg-white dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl p-6 flex flex-col hover:border-sky-300 dark:hover:border-slate-500 transition-colors">
                                <h3 className="text-xl font-bold mb-2 text-sky-950 dark:text-white">30 Day Biology</h3>
                                <p className="text-sky-800 dark:text-slate-400 mb-6 text-sm flex-grow">Dominate Botany & Zoology with pure NCERT focus.</p>
                                <div className="mb-4 flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-sky-600 dark:text-sky-400">₹{getPrice("30 Day Biology")}</span>
                                    <span className="text-sm font-medium text-sky-800/60 dark:text-slate-400/60 line-through">₹{getPrice("30 Day Biology", true)}</span>
                                </div>
                                <span className="block mb-4 text-xs font-semibold text-rose-600/80 dark:text-rose-400/80 uppercase tracking-wider">Valid for 45 Days</span>
                                <ul className="space-y-3 mb-8 text-sm text-sky-900 dark:text-slate-300">
                                    {['Biology concepts only', 'High-weightage focus', 'Line-by-line NCERT'].map((f, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="text-sky-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/login" className="block text-center w-full py-2.5 rounded-lg font-semibold bg-sky-50 dark:bg-slate-700/50 text-sky-900 dark:text-slate-200 hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors mt-auto border border-sky-100 dark:border-slate-600">Select Biology</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Final CTA */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        Start with the Free Diagnostic. Upgrade only when you see improvement.
                    </h2>
                    <Link href="/login" className="cursor-pointer inline-flex items-center gap-3 px-10 py-5 text-xl rounded-lg font-semibold bg-emerald-600 text-white hover:scale-105 transition-transform shadow-lg">
                        <span>👉 Take Free Diagnostic Test</span>
                        <ArrowRight size={24} />
                    </Link>
                    <p className="text-sky-800 dark:text-slate-400 mt-6 font-medium">
                        NeetStand is focused on performance improvement — not random questions. Get direction that moves your score.
                    </p>
                </div>
            </FadeIn>
        </HeroClient>
    );
};

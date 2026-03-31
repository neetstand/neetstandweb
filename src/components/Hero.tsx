import { HeroClient } from "./HeroClient";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, ArrowUp, Target, BookOpen, TrendingUp } from 'lucide-react';
import { FadeIn } from "./FadeIn"; // Assuming FadeIn is in the same directory

export const Hero = async () => {
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

            {/* Free Announcement */}
            <FadeIn className="py-24 px-6 bg-transparent">
                <div className="max-w-6xl mx-auto relative cursor-default">
                    {/* Glowing background blob */}
                    <div className="absolute inset-0 bg-emerald-400 blur-[120px] opacity-20 dark:opacity-30 rounded-full scale-110 animate-pulse pointer-events-none"></div>

                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border border-sky-200 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                        
                        {/* Premium Dotted Grid Background */}
                        <div className="absolute inset-0 [background:radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15] dark:opacity-[0.1] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-slate-900/60 dark:to-slate-900 pointer-events-none"></div>

                        {/* Corner decorative lights */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-400/30 dark:from-emerald-500/20 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-400/20 dark:from-sky-500/20 to-transparent blur-3xl rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
                        
                        <div className="relative p-10 md:p-20 flex flex-col items-center text-center">
                            
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border mb-8 bg-white/50 dark:bg-black/40 border-emerald-200/80 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 backdrop-blur-md shadow-sm transition-transform hover:scale-105">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold tracking-widest uppercase">Special Announcement</span>
                            </div>

                            {/* Headline */}
                            <h2 className="text-5xl md:text-7xl font-black mb-6 text-sky-950 dark:text-white tracking-tight leading-[1.15]">
                                We took a stand.<br />
                                <span className="inline-block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 drop-shadow-sm pb-2">
                                    NEETStand is 100% Free.
                                </span>
                            </h2>

                            {/* Divider line */}
                            <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 mb-10"></div>

                            {/* Descriptive Text */}
                            <p className="text-xl md:text-2xl text-sky-800 dark:text-slate-300 mb-12 max-w-3xl font-medium leading-relaxed">
                                No paywalls. No hidden fees. We believe every aspirant deserves access to the right tools for their final revision jump. Get complete access to <span className="font-bold text-sky-950 dark:text-white bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-lg">Physics, Chemistry, and Biology.</span>
                            </p>

                            {/* Quotes / Tagline */}
                            <div className="mb-14 relative">
                                <div className="absolute -inset-6 bg-emerald-100/50 dark:bg-emerald-900/20 blur-2xl rounded-full"></div>
                                <p className="relative text-2xl md:text-3xl font-bold italic text-emerald-600 dark:text-emerald-400">
                                    "Enjoy the Freedom."
                                </p>
                            </div>

                            {/* Call to action */}
                            <div className="relative group/btn mt-4">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-70 transition duration-500 animate-tilt"></div>
                                <Link href="/login" className="relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] border border-emerald-400/20 hover:-translate-y-1">
                                    Start Practicing Now
                                    <ArrowRight size={24} className="group-hover/btn:translate-x-1.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Final CTA */}
            <FadeIn className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        Start your journey today. Track your improvement.
                    </h2>
                    <Link href="/login" className="cursor-pointer inline-flex items-center gap-3 px-10 py-5 text-xl rounded-lg font-bold bg-emerald-600 text-white hover:scale-105 transition-transform shadow-lg hover:shadow-emerald-600/30">
                        <span>👉 Take Free Diagnostic Test</span>
                        <ArrowRight size={24} />
                    </Link>
                    <p className="text-sky-800 dark:text-slate-400 mt-6 font-medium text-lg">
                        NeetStand is focused on performance improvement — not random questions. Get direction that moves your score.
                    </p>
                </div>
            </FadeIn>
        </HeroClient>
    );
};

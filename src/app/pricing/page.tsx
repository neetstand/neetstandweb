import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PricingPage() {
    return (
        <main className="min-h-screen flex flex-col pt-16 pb-24 bg-transparent text-sky-950 dark:text-slate-100">
            <div className="max-w-6xl mx-auto px-6 w-full relative cursor-default">
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
                        <h2 className="text-5xl md:text-7xl font-black mb-4 text-sky-950 dark:text-white tracking-tight leading-[1.15]">
                            We took a stand.<br />
                            <span className="inline-block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 dark:from-emerald-400 dark:via-teal-300 dark:to-sky-400 drop-shadow-sm pb-2">
                                NEETStand is 100% Free.
                            </span>
                        </h2>
                        
                        <p className="text-sm md:text-base font-bold text-sky-600/80 dark:text-slate-400/80 uppercase tracking-widest mb-8">
                            * Pricing may change.
                        </p>

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
                        
                        {/* Disclaimer */}
                        <p className="mt-8 text-xs text-sky-700/70 dark:text-slate-400/70 max-w-lg mx-auto leading-relaxed">
                            <span className="font-bold text-sky-800 dark:text-slate-300">*</span> Pricing is subject to change in the future. NEETStand will not be free forever.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

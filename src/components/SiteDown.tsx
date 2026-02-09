"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiteDown() {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white overflow-hidden selection:bg-rose-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl px-6 text-center">
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm shadow-xl">
                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6">
                    Under Maintenance
                </h1>

                <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                    We are currently performing scheduled updates to improve your experience.
                    <br className="hidden md:block" />
                    Services will be back shortly.
                </p>

                <div className="inline-flex flex-col items-center space-y-4">
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-rose-500 to-transparent rounded-full opacity-50" />
                    <p className="text-sm font-bold uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        System Status: <span className="text-rose-400 animate-pulse">Updating</span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 w-full text-center z-10">
                <p className="text-xs text-slate-600">
                    &copy; {year || 2026} NEET Stand. All rights reserved.
                </p>
            </div>
        </div>
    );
}

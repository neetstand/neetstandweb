"use client";

import React from "react";
import { HaloBackground } from "@/components/HaloBackground";

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-20 pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            {/* Animated Halo Background */}
            {/* Animated Halo Background */}
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Header Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">
                        About Us – NeetStand
                    </h1>
                    <h2 className="text-2xl font-bold">The Right Stop for NEET Prep</h2>
                    <div className="text-lg space-y-4 text-sky-900 dark:text-slate-300">
                        <p>
                            NEET preparation is not about doing more.
                            <br />
                            It is about doing <strong>what actually improves your score.</strong>
                        </p>
                        <p>
                            NeetStand was created to solve one simple problem faced by thousands
                            of NEET aspirants:{" "}
                            <strong>practicing endlessly without clear improvement.</strong>
                        </p>
                    </div>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* Why NeetStand Exists */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Why NeetStand Exists</h2>
                    <p className="text-lg">Most NEET students:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-sky-900 dark:text-slate-300">
                        <li>Solve hundreds of MCQs daily</li>
                        <li>Revise the same chapters repeatedly</li>
                        <li>Yet remain stuck at the same score range</li>
                    </ul>
                    <div className="text-lg space-y-4">
                        <p>
                            Not because they lack effort —<br />
                            but because they lack <strong>direction.</strong>
                        </p>
                        <p>NeetStand exists to provide that direction.</p>
                    </div>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* Our Philosophy */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Our Philosophy</h2>
                    <p className="text-lg">We believe NEET preparation needs:</p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-sky-900 dark:text-slate-300">
                        <li>Fewer random questions</li>
                        <li>More focused correction of mistakes</li>
                        <li>
                            Strong alignment with <strong>NCERT</strong>
                        </li>
                    </ul>
                    <p className="text-lg">
                        Instead of pushing students forward blindly, NeetStand encourages
                        them to <strong>pause, identify, and fix</strong> what is holding
                        them back.
                    </p>
                    <p className="text-lg font-semibold italic">
                        That is why we call it <strong>The Right Stop for NEET Prep.</strong>
                    </p>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* What Makes NeetStand Different */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">What Makes NeetStand Different</h2>
                    <p className="text-lg">
                        At NeetStand, your preparation is guided by{" "}
                        <strong>your mistakes.</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-lg text-sky-900 dark:text-slate-300">
                        <li>Every practice session adapts to your past errors</li>
                        <li>Questions are selected based on exam relevance</li>
                        <li>Explanations are rooted in NCERT concepts</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}

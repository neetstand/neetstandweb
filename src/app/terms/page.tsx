"use client";

import React from "react";
import { HaloBackground } from "@/components/HaloBackground";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-20 pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            {/* Animated Halo Background */}
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <section className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-sky-800 dark:text-slate-400">
                        Last Updated: February 2026
                    </p>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* Content */}
                <div className="space-y-8 text-lg text-sky-900 dark:text-slate-300">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using NeetStand, you <span className="font-bold underline">agree to be bound</span> by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">2. Use of Service</h2>
                        <p>
                            NeetStand is an educational platform designed for NEET preparation. You agree to use the platform solely for <span className="font-bold underline">personal educational purposes</span>. You may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><span className="font-bold underline">Share your account credentials</span> with others.</li>
                            <li>Attempt to <span className="font-bold underline">copy, scrape, or reverse-engineer</span> any part of the platform.</li>
                            <li>Use the service for any <span className="font-bold underline">illegal or unauthorized purpose</span>.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">3. User Accounts</h2>
                        <p>
                            You are responsible for <span className="font-bold underline">maintaining the confidentiality</span> of your account and password. You agree to <span className="font-bold underline">notify us immediately</span> of any unauthorized use of your account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">4. Intellectual Property</h2>
                        <p>
                            All content, including questions, explanations, text, graphics, and logos, is the <span className="font-bold underline">property of NeetStand</span> and is protected by copyright and other intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">5. Limitation of Liability</h2>
                        <p>
                            NeetStand is provided "as is" without warranties of any kind. We are <span className="font-bold underline">not liable for any damages</span> arising from your use of the service or any interruptions in the service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">6. Contact Us</h2>
                        <p>
                            If you have questions about these terms, please contact us at: <br />
                            <a href="mailto:support@neetstand.com" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
                                support@neetstand.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

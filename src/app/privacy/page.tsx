"use client";

import React from "react";
import { HaloBackground } from "@/components/HaloBackground";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen pt-20 pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            {/* Animated Halo Background */}
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                {/* Header Section */}
                <section className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-sky-800 dark:text-slate-400">
                        Last Updated: February 2026
                    </p>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* Content */}
                <div className="space-y-8 text-lg text-sky-900 dark:text-slate-300">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">1. Introduction</h2>
                        <p>
                            At NeetStand ("we," "our," or "us"), we respect your privacy and are <span className="font-bold underline">committed to protecting the personal information</span> you share with us. This Privacy Policy explains how we collect, use, and <span className="font-bold underline">safeguard your data</span> when you use our website and services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">2. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><span className="font-bold underline">Personal Information:</span> Name, email address, phone number, and other details provided during registration.</li>
                            <li><span className="font-bold underline">Usage Data:</span> Information about how you interact with our platform, including progress, quiz scores, and time spent on modules.</li>
                            <li><span className="font-bold underline">Device Information:</span> IP address, browser type, and operating system for security and optimization purposes.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">3. How We Use Your Information</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><span className="font-bold underline">Provide and personalize</span> your NEET preparation experience.</li>
                            <li><span className="font-bold underline">Analyze performance</span> to offer targeted recommendations.</li>
                            <li><span className="font-bold underline">Send important updates</span>, newsletters, and educational content.</li>
                            <li><span className="font-bold underline">Ensure the security</span> and integrity of our platform.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">4. Data Security</h2>
                        <p>
                            We implement <span className="font-bold underline">industry-standard security measures</span> to protect your data. However, no method of transmission over the internet is 100% secure, and we <span className="font-bold underline">cannot guarantee absolute security</span>.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">5. Cookie Policy</h2>
                        <p>
                            We use <span className="font-bold underline">cookies and similar tracking technologies</span> to track the activity on our service and hold certain information. You can instruct your browser to <span className="font-bold underline">refuse all cookies</span> or to indicate when a cookie is being sent.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-sky-950 dark:text-slate-100">6. Contact Us</h2>
                        <p>
                            If you have questions about this policy, please contact us at: <br />
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

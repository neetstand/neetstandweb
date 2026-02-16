"use client";

import React from "react";
import { HaloBackground } from "@/components/HaloBackground";

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-20 pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            {/* Animated Halo Background */}
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                {/* Header Section */}
                <section className="space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">
                        Contact Us – NeetStand
                    </h1>
                    <h2 className="text-2xl font-bold">We'd love to hear from you</h2>
                    <div className="text-lg space-y-4 text-sky-900 dark:text-slate-300">
                        <p>
                            Have questions, feedback, or need support?
                            <br />
                            We are here to help you on your NEET preparation journey.
                        </p>
                    </div>
                </section>

                <hr className="border-sky-200 dark:border-slate-700" />

                {/* Contact Details */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Get in Touch</h2>
                    <div className="text-lg space-y-4 text-sky-900 dark:text-slate-300">
                        <p>
                            For support inquiries, please email us at:
                            <br />
                            <a href="mailto:support@neetstand.com" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
                                support@neetstand.com
                            </a>
                        </p>
                        <p>
                            For general inquiries:
                            <br />
                            <a href="mailto:hello@neetstand.com" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
                                hello@neetstand.com
                            </a>
                        </p>
                    </div>
                </section>
            </div>
        </main >
    );
}

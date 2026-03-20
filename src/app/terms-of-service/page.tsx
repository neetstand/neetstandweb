import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServiceClient() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-500/20 dark:selection:bg-indigo-500/30">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50">
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <div className="font-bold tracking-tight text-slate-900 dark:text-white">NEETStand</div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Terms of Service (NEETStand)</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium pb-8 border-b border-slate-200 dark:border-slate-800">Last Updated: 26th Feb, 2026</p>

                    <p>Welcome to <strong>NEETStand</strong>, an educational platform owned and operated by <strong>Dhanvid Edutech Private Limited</strong> ("Company", "Platform", "we", "our", "us").</p>

                    <p>These Terms of Service ("Terms") govern your access to and use of NEETStand's website, mobile application, and related services (collectively, the "Services"). By registering, accessing, or using the Services, you agree to these Terms as well as our <Link href="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Privacy Policy</Link> and <Link href="/refund-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Refund Policy</Link>. If you do not agree, you must not use our Services.</p>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">1. Eligibility</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>NEETStand offers courses designed for students of NEET.</li>
                        <li>If you are under 18 years of age, you may access and use the Services only with the consent and supervision of a parent or legal guardian.</li>
                        <li>Parents/guardians agree to be responsible for the student's use of the Services, including any purchases made.</li>
                        <li>NEETStand is intended for individual use only. Schools, coaching institutions, or other organizations may not register or use the Services on behalf of students without an express written agreement with Dhanvid EdTech Pvt. Ltd.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">2. Accounts & Security</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>You agree to provide accurate and complete information when creating an account.</li>
                        <li>You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</li>
                        <li>You may not impersonate another person, share your account, or misrepresent your identity.</li>
                        <li>We reserve the right to suspend or terminate your account for any violation of these Terms.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">3. Use of Services/Platform</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>NEETStand provides interactive courses, video lectures, and digital learning resources.</li>
                        <li>Services are for <strong>personal, non-commercial educational use only</strong>.</li>
                        <li>Resale, redistribution, or unauthorized sharing of content is strictly prohibited.</li>
                        <li>We may, at our discretion, provide free trials, referral-based benefits, and limited-time offers.</li>
                    </ul>
                </article>

                <article className="prose prose-slate dark:prose-invert max-w-none mt-12 pb-16">
                    <h2 className="text-2xl font-bold mb-4 tracking-tight">4. Payment & Refunds</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>All course fees are payable in advance and are non-transferable.</li>
                        <li>Payments are processed through secure third-party gateways. We do not store your credit/debit card details.</li>
                        <li>For details on cancellations and refunds, please refer to our <Link href="/refund-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Refund Policy</Link>.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">5. Intellectual Property</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>All content, including videos, study materials, notes, test series, graphics, and logos, is the exclusive property of Dhanvid Edutech Private Limited.</li>
                        <li>You may not copy, reproduce, modify, distribute, or create derivative works from any part of the Platform without written permission.</li>
                        <li>Unauthorized use of our intellectual property may result in legal action and account termination.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">6. User Conduct</h2>
                    <p>You agree not to:</p>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>Use the Services for any illegal or unauthorized purpose.</li>
                        <li>Harass, abuse, or harm other users, instructors, or staff.</li>
                        <li>Interfere with or disrupt the operation of the Platform.</li>
                        <li>Attempt to hack, reverse engineer, or gain unauthorized access to our systems.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">7. Disclaimer of Warranties & Liability</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>NEETStand provides educational resources on an "as-is" and "as-available" basis. We do not guarantee success in exams or specific academic outcomes.</li>
                        <li>We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Services or inability to access them.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">8. Changes to Terms</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>We reserve the right to update these Terms at any time. Changes will be effective immediately upon posting.</li>
                        <li>Your continued use of the Services after modifications indicates your acceptance of the updated Terms.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">9. Limitation of Liability</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>Services are provided <strong>"as is"</strong> without warranties of any kind.</li>
                        <li>We are not liable for:
                            <ul className="list-[circle] pl-6 mt-2 space-y-1 marker:text-slate-300 dark:marker:text-slate-600">
                                <li>Technical errors, downtime, or failures of internet or third-party providers.</li>
                                <li>Any indirect, incidental, or consequential damages.</li>
                            </ul>
                        </li>
                        <li>Our maximum liability is limited to the amount you paid for the Services availed by user.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">10. Termination</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>You may cancel your subscription or request account deletion at any time.</li>
                        <li>We reserve the right to suspend or terminate your access, with or without prior information, if you violate these Terms, misuse the Services/Platform, or engage in unlawful activities.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">11. Governing Law & Disputes</h2>
                    <ul className="space-y-2 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>These Terms are governed by the laws of <strong>India</strong>.</li>
                        <li>Any disputes will fall under the exclusive jurisdiction of the courts in <strong>Kota, Rajasthan</strong>.</li>
                        <li>Certain disputes may be referred to arbitration in accordance with applicable Indian arbitration laws.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-12 mb-4 tracking-tight">12. Contact Us</h2>
                    <p className="mt-4">For any queries or concerns regarding these Terms:</p>
                    <ul className="space-y-2 mt-4 list-none pl-0">
                        <li className="flex items-center gap-2">📧 <strong>Email:</strong> <a href="mailto:support@neetstand.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@neetstand.com</a></li>
                        <li className="flex items-center gap-2">💻 <strong>Website:</strong> <a href="https://neetstand.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://neetstand.com</a></li>
                        <li className="mt-4"><strong>Legal Entity:</strong> <em>Dhanvid Edutech Private Limited</em></li>
                    </ul>
                </article>
            </main>
        </div>
    );
}

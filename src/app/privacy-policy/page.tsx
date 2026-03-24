import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyClient() {
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
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Privacy Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium pb-8 border-b border-slate-200 dark:border-slate-800">Last Updated: 26th Feb 2026</p>

                    <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our learning platform <strong>neetstand.com - a product of Dhanvid Edutech Private Limited hereinafter referred to as "NEETStand / Platform"</strong></p>

                    <p>By accessing or registering on Platform, you agree to the practices described in this Privacy Policy, as well as our <Link href="/terms-of-service" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms & Conditions</Link> and <Link href="/refund-policy" className="text-indigo-600 dark:text-indigo-400 hover:underline">Refund & Cancellation Policy</Link>.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">1. Information We Collect</h2>
                    <p>We collect the following types of information:</p>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, login credentials, school/guardian details (if applicable).</li>
                        <li><strong>Payment Information:</strong> Processed securely by Razorpay. We do not store your complete card/bank details.</li>
                        <li><strong>Account & Learning Data:</strong> Courses accessed, progress, practice history, scores.</li>
                        <li><strong>Device & Usage Information:</strong> IP address, browser type, operating system, cookies, and analytics data.</li>
                        <li><strong>Social Logins:</strong> If you sign in with Google, Facebook, or other providers, we may receive limited profile data as permitted by them.</li>
                        <li><strong>Information from Schools/Guardians:</strong> If a school or parent registers students, we may collect details on their behalf.</li>
                    </ul>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">2. How We Use Your Information</h2>
                    <p>Your data is used only for legitimate educational and operational purposes, including:</p>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>To provide and personalize learning services.</li>
                        <li>To process payments and grant course access.</li>
                        <li>To improve our content, security, and platform features.</li>
                        <li>To communicate updates, progress reports, and important notices.</li>
                        <li>To comply with legal and regulatory obligations.</li>
                    </ul>
                    <p className="mt-6 font-medium">We <strong>do not sell your personal information</strong> to third parties.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">3. Sharing of Information</h2>
                    <p>We may share information only in these cases:</p>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li><strong>Service Providers:</strong> With trusted partners such as Supabase (cloud storage & authentication), Razorpay (payments), analytics and email providers, strictly for service delivery.</li>
                        <li><strong>Legal Compliance:</strong> If required by law, regulation, or court order.</li>
                    </ul>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">4. Data Retention</h2>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>We retain personal data as long as your account is active or as required by law.</li>
                        <li>Learning history may be retained for academic and reporting purposes.</li>
                        <li>You may request deletion of your account and associated data at any time (see Section 6).</li>
                    </ul>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">5. Children's Privacy</h2>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>Our services are intended for students aged <strong>under 18 only with parental/guardian consent</strong>.</li>
                        <li>We do not knowingly collect personal data from children without such consent.</li>
                        <li>If we discover that data has been collected without proper consent, we will delete it immediately.</li>
                    </ul>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>Access the data we hold about you.</li>
                        <li>Correct inaccuracies in your personal information.</li>
                        <li>Request deletion of your account and data.</li>
                        <li>Withdraw consent for processing (may affect service availability).</li>
                        <li>Request a copy of your personal data in portable format.</li>
                    </ul>
                    <p className="mt-6 font-medium">Requests can be made by contacting us at <strong>support@neetstand.com</strong>.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">7. Data Protection & Security</h2>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>All personal data is stored securely using <strong>Supabase</strong> and encrypted in transit.</li>
                        <li>Payments are processed securely via <strong>Razorpay</strong>.</li>
                        <li>We implement industry-standard security measures, but no system is 100% secure.</li>
                    </ul>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">8. Cookies & Tracking</h2>
                    <p>We use cookies and similar technologies for:</p>
                    <ul className="space-y-3 mt-4 list-disc pl-6 marker:text-slate-400">
                        <li>Authentication and login sessions.</li>
                        <li>Remembering preferences.</li>
                        <li>Analytics and performance monitoring.</li>
                    </ul>
                    <p className="mt-6">You can disable cookies in your browser, but some features may not work properly.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">9. International Users</h2>
                    <p>If you access our services outside India, please note that your data will be processed and stored in India. By using our services, you consent to such transfer.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">10. Updates to this Policy</h2>
                    <p>We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last Updated" date. Continued use of the Platform after changes means you accept the updated policy.</p>

                    <hr className="my-10 border-slate-200 dark:border-slate-800" />

                    <h2 className="text-2xl font-bold mb-6 tracking-tight">11. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us:</p>
                    <ul className="space-y-3 mt-4 list-none pl-0">
                        <li className="flex items-center gap-2"><strong>Email:</strong> <a href="mailto:support@neetstand.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">support@neetstand.com</a></li>
                        <li className="flex items-center gap-2"><strong>Website:</strong> <a href="https://neetstand.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://neetstand.com</a></li>
                    </ul>

                </article>
            </main>
        </div>
    );
}

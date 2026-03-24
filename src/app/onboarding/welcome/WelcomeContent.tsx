import { BigButton } from "@/components/onboarding/BigButton";
import Image from "next/image";

export default function WelcomeContent() {
    return (
        <div className="relative w-full max-w-3xl mx-auto px-6 min-h-[40vh] flex flex-col items-center justify-center text-center">

            {/* Decorative Elements */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl bg-gradient-to-tr from-purple-50/30 to-blue-50/30 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-30 pointer-events-none -z-10" />

            <div
                className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center mb-2">
                        <Image src="/neetstand-light.png" alt="NEETStand Logo" width={200} height={50} style={{ width: 'auto', height: 'auto' }} className="dark:hidden max-h-12" />
                        <Image src="/neetstand-dark.png" alt="NEETStand Logo" width={200} height={50} style={{ width: 'auto', height: 'auto' }} className="hidden dark:block max-h-12" />
                    </div>
                    <div
                        className="inline-block px-4 py-1.5 rounded-full bg-green-50 dark:bg-emerald-900/30 border border-green-100 dark:border-emerald-800 text-sm font-medium text-green-700 dark:text-emerald-400 tracking-wider uppercase animate-in fade-in zoom-in-95 duration-700 delay-200 fill-mode-both"
                    >
                        NEETStand is here
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 dark:text-slate-50 leading-[1.2] max-w-2xl mx-auto">
                        Ready to Begin your Journey
                    </h1>
                </div>

                <div className="space-y-4 text-lg text-gray-600 dark:text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
                    <p>
                        Smarter prep. Real growth.
                    </p>
                    <div className="text-xl text-gray-900 dark:text-slate-200 font-medium">
                        Your personal Mentor.
                    </div>
                </div>

                <div className="pt-2 flex flex-col items-center space-y-4">
                    <BigButton
                        href="/onboarding/identification"
                        className="text-lg py-5 px-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-gray-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-full w-auto cursor-pointer"
                    >
                        Start the Transformation
                    </BigButton>
                </div>
            </div>
        </div>
    );
}

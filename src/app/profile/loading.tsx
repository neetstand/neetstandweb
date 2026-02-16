import { HaloBackground } from "@/components/HaloBackground";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="min-h-screen pt-[76px] pb-16 px-6 bg-sky-50 dark:bg-slate-900 text-sky-950 dark:text-slate-100 relative overflow-hidden">
            <HaloBackground />

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48 bg-sky-200/50 dark:bg-slate-800/50" />
                    <Skeleton className="h-5 w-72 bg-sky-200/50 dark:bg-slate-800/50" />
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Left Column Skeleton */}
                    <div className="md:col-span-1">
                        <div className="h-[400px] rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-sky-100 dark:border-slate-800 shadow-xl p-6 flex flex-col items-center space-y-4">
                            <Skeleton className="h-24 w-24 rounded-full bg-sky-200/50 dark:bg-slate-800/50" />
                            <Skeleton className="h-8 w-32 bg-sky-200/50 dark:bg-slate-800/50" />
                            <Skeleton className="h-4 w-40 bg-sky-200/50 dark:bg-slate-800/50" />
                            <div className="w-full space-y-2 mt-4">
                                <Skeleton className="h-10 w-full bg-sky-200/50 dark:bg-slate-800/50" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="md:col-span-2">
                        <div className="h-[500px] rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-sky-100 dark:border-slate-800 shadow-xl p-6 space-y-6">
                            <Skeleton className="h-8 w-48 bg-sky-200/50 dark:bg-slate-800/50" />
                            <div className="space-y-4">
                                <Skeleton className="h-20 w-full bg-sky-200/50 dark:bg-slate-800/50" />
                                <Skeleton className="h-20 w-full bg-sky-200/50 dark:bg-slate-800/50" />
                                <Skeleton className="h-20 w-full bg-sky-200/50 dark:bg-slate-800/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

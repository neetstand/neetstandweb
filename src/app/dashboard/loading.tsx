export default function DashboardLoading() {
    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center justify-center p-4">
            <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 p-10 w-full animate-pulse">
                <main className="flex-1 flex flex-col gap-6">
                    {/* Title Skeleton */}
                    <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />

                    {/* Welcome Text Skeleton */}
                    <div className="h-7 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />

                    {/* Content Box Skeleton */}
                    <div className="p-6 border rounded-lg bg-card/50 space-y-4">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                        <div className="h-5 w-full max-w-sm bg-gray-200 dark:bg-gray-800 rounded-lg" />
                    </div>

                    {/* Button Skeleton */}
                    <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mt-4" />
                </main>
            </div>
        </div>
    );
}

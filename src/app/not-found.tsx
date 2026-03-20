import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-4">
                404
            </h1>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Page Not Found
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-md text-center">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline" className="gap-2">
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </Link>
                </Button>
                <Button asChild className="gap-2 bg-sky-500 hover:bg-sky-600">
                    <Link href="/dashboard">
                        <Home className="w-4 h-4" /> Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    );
}

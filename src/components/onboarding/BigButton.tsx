import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import React from "react";

import Link from "next/link";

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: "primary" | "secondary" | "outline";
    href?: string;
}

export function BigButton({ className, children, loading, variant = "primary", disabled, href, ...props }: BigButtonProps) {
    const baseStyles = "w-full max-w-sm py-6 text-lg font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] inline-flex items-center justify-center";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-lg hover:shadow-xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        outline: "border-2 border-gray-200 bg-transparent text-gray-900 hover:border-gray-900 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
    };

    if (href) {
        return (
            <Link
                href={href}
                className={cn(baseStyles, variants[variant], className, (disabled || loading) && "opacity-50 pointer-events-none")}
            >
                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {children}
            </Link>
        );
    }

    return (
        <Button
            className={cn(baseStyles, variants[variant], className)}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {children}
        </Button>
    );
}

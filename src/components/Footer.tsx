"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export const Footer = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isDark = theme === "dark";

    return (
        <footer className="py-12 px-6 bg-sky-200 dark:bg-slate-800 text-sky-950 dark:text-slate-100 border-t border-sky-300 dark:border-slate-600 text-base">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                    <h3 className="font-bold text-lg mb-4">
                        <Image
                            src={isDark ? "/neetstand-dark.png" : "/neetstand-light.png"}
                            alt="NEETStand Logo"
                            width={150}
                            height={40}
                            style={{ height: "40px", width: "auto" }}
                        />
                    </h3>
                    <p className="text-sky-800 dark:text-slate-400">
                        The Right Stop for NEET Prep
                    </p>
                </div>
                {[
                    {
                        title: "Product",
                        links: [
                            { label: "Features", href: "/#features" },
                            { label: "Pricing", href: "/#pricing" },
                            { label: "How It Works", href: "/#how-it-works" },
                        ],
                    },
                    {
                        title: "Resources",
                        links: [
                            { label: "Blog", href: "#" },
                            { label: "About Us", href: "/about" },
                            { label: "Contact", href: "#" },
                        ],
                    },
                    {
                        title: "Legal",
                        links: [
                            { label: "Privacy Policy", href: "#" },
                            { label: "Terms of Service", href: "#" },
                        ],
                    },
                ].map((col, i) => (
                    <div key={i}>
                        <h4 className="font-bold mb-4">{col.title}</h4>
                        <ul className="text-sky-800 dark:text-slate-400 space-y-2">
                            {col.links.map((link, j) => (
                                <li key={j}>
                                    <Link
                                        href={link.href}
                                        className="cursor-pointer hover:text-sky-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-sky-300 dark:border-slate-600 pt-8 text-center text-sky-800 dark:text-slate-400">
                <p>© 2026 NEETStand. All rights reserved.</p>
            </div>
        </footer>
    );
};

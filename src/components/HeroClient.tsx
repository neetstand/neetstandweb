"use client";

import { WavyBackground } from "./WavyBackground";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { RotatingTriangle } from './RotatingTriangle';


const staggerChildren = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
};

const item = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


export const HeroClient = ({ children }: { children: React.ReactNode }) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return <div className="min-h-screen bg-transparent text-foreground"></div>;
    }

    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <WavyBackground
            containerClassName={`transition-colors duration-300 ${isDark ? 'dark' : ''} text-sky-950 dark:text-slate-100`}
            colors={isDark ? ["#3b82f6", "#60a5fa", "#22d3ee", "#818cf8", "#2563eb"] : undefined}
            backgroundFill={isDark ? "#0b1121" : "#f0f9ff"}
            speed="slow"
            className="w-full"
        >
            <div className="relative z-10 w-full">


                {/* Hero */}
                <section className={`relative overflow-hidden px-6 pt-4 pb-8 md:py-20 bg-transparent`}>
                    {/* Stethoscope Background */}
                    <div
                        className="absolute top-[5%] -right-[5%] w-[45%] h-[90%] opacity-[0.12] dark:opacity-[0.15] pointer-events-none bg-contain bg-no-repeat bg-right-center rotate-[10deg]"
                        style={{
                            backgroundImage: isDark
                                ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 500'%3E%3C!-- Earpieces --%3E%3Ccircle cx='80' cy='50' r='20' fill='%2338bdf8'/%3E%3Ccircle cx='220' cy='50' r='20' fill='%2338bdf8'/%3E%3C!-- Tubes from earpieces --%3E%3Cpath d='M 80 70 Q 80 120 100 150' fill='none' stroke='%2338bdf8' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M 220 70 Q 220 120 200 150' fill='none' stroke='%2338bdf8' stroke-width='6' stroke-linecap='round'/%3E%3C!-- Y-junction --%3E%3Cpath d='M 100 150 Q 130 180 150 200' fill='none' stroke='%2338bdf8' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M 200 150 Q 170 180 150 200' fill='none' stroke='%2338bdf8' stroke-width='6' stroke-linecap='round'/%3E%3C!-- Main tube --%3E%3Cpath d='M 150 200 L 150 380' fill='none' stroke='%23059669' stroke-width='7' stroke-linecap='round'/%3E%3C!-- Chest piece (diaphragm) --%3E%3Ccircle cx='150' cy='420' r='35' fill='none' stroke='%23059669' stroke-width='8'/%3E%3Ccircle cx='150' cy='420' r='25' fill='%23059669' opacity='0.3'/%3E%3C!-- Bell --%3E%3Cellipse cx='150' cy='455' rx='30' ry='15' fill='%23059669' opacity='0.4'/%3E%3C/svg%3E")`
                                : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 500'%3E%3C!-- Earpieces --%3E%3Ccircle cx='80' cy='50' r='20' fill='%23059669'/%3E%3Ccircle cx='220' cy='50' r='20' fill='%23059669'/%3E%3C!-- Tubes from earpieces --%3E%3Cpath d='M 80 70 Q 80 120 100 150' fill='none' stroke='%23059669' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M 220 70 Q 220 120 200 150' fill='none' stroke='%23059669' stroke-width='6' stroke-linecap='round'/%3E%3C!-- Y-junction --%3E%3Cpath d='M 100 150 Q 130 180 150 200' fill='none' stroke='%23059669' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M 200 150 Q 170 180 150 200' fill='none' stroke='%23059669' stroke-width='6' stroke-linecap='round'/%3E%3C!-- Main tube --%3E%3Cpath d='M 150 200 L 150 380' fill='none' stroke='%23059669' stroke-width='7' stroke-linecap='round'/%3E%3C!-- Chest piece (diaphragm) --%3E%3Ccircle cx='150' cy='420' r='35' fill='none' stroke='%23059669' stroke-width='8'/%3E%3Ccircle cx='150' cy='420' r='25' fill='%23059669' opacity='0.3'/%3E%3C!-- Bell --%3E%3Cellipse cx='150' cy='455' rx='30' ry='15' fill='%23059669' opacity='0.4'/%3E%3C/svg%3E")`
                        }}
                    ></div>

                    {/* Additional decorative medical cross */}
                    <div
                        className="absolute bottom-[5%] left-[5%] w-20 h-20 opacity-10 dark:opacity-[0.12] pointer-events-none bg-contain bg-no-repeat"
                        style={{
                            backgroundImage: isDark
                                ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M35 0 L65 0 L65 35 L100 35 L100 65 L65 65 L65 100 L35 100 L35 65 L0 65 L0 35 L35 35 Z' fill='%2338bdf8'/%3E%3C/svg%3E")`
                                : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M35 0 L65 0 L65 35 L100 35 L100 65 L65 65 L65 100 L35 100 L35 65 L0 65 L0 35 L35 35 Z' fill='%23059669'/%3E%3C/svg%3E")`
                        }}
                    ></div>

                    <div className="flex flex-col gap-12 max-w-7xl mx-auto relative z-10 w-full">
                        {/* Desktop Layout */}
                        <div className="hidden md:grid grid-cols-2 gap-12 items-center">
                            {/* Left: Logo, tagline and CTA */}
                            <motion.div
                                className="text-left flex flex-col gap-8"
                                variants={staggerChildren}
                                initial="initial"
                                animate="animate"
                            >
                                <motion.div variants={item}>
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                        <span className="text-sky-950 dark:text-white">NEET</span>
                                        <span className="text-emerald-600">Stand</span>
                                    </h1>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-0">The Right Stop for NEET Prep</h2>
                                </motion.div>

                                <motion.div className="text-xl text-sky-800 dark:text-slate-400" variants={item}>
                                    <p className="mb-2"><span className="dark:text-blue-300">Don't</span> just practice.</p>
                                    <p className="mb-2">Pinpoint your mistakes.</p>
                                    <p>Fix them and improve your score.</p>
                                </motion.div>

                                <motion.div variants={item}>
                                    <Link href="/login" className="cursor-pointer inline-block px-8 py-4 rounded-lg font-semibold bg-emerald-600 dark:bg-emerald-500 text-white hover:scale-105 transition-transform text-lg shadow-lg">
                                        Take Free Diagnostic Test
                                    </Link>
                                    <p className="mt-4 text-sm italic text-sky-800 dark:text-slate-400">
                                        Discover exactly why your score is stuck
                                    </p>
                                </motion.div>
                            </motion.div>

                            {/* Right: Rotating Triangle with Student Journey */}
                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <RotatingTriangle isDark={isDark} />
                            </motion.div>
                        </div>

                        {/* Mobile Layout */}
                        <div className="block md:hidden">
                            {/* Logo and tagline */}
                            <motion.div
                                className="text-center mb-8 relative"
                                variants={staggerChildren}
                                initial="initial"
                                animate="animate"
                            >
                                {/* Mobile Dark Mode Halo - Positioned relative to this container but with better centering logic */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white opacity-[0.15] blur-[80px] rounded-full -z-10 hidden dark:block pointer-events-none" />

                                <motion.h1 className="text-[2.5rem] font-bold mb-2 leading-tight relative z-10" variants={item}>
                                    <span className="text-sky-950 dark:text-white">NEET</span>
                                    <span className="text-emerald-600">Stand</span>
                                </motion.h1>
                                <motion.h2 className="text-[1.5rem] font-bold relative z-10" variants={item}>The Right Stop for NEET Prep</motion.h2>
                            </motion.div>

                            {/* Rotating Triangle */}
                            <motion.div
                                className="-mb-36 mt-8"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            >
                                <RotatingTriangle isDark={isDark} scale={0.75} />
                            </motion.div>

                            {/* CTA and value prop */}
                            <motion.div
                                className="text-center -mt-16"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <div className="text-lg text-sky-800 dark:text-slate-400 mb-6 font-medium">
                                    <p className="mb-2"><span className="dark:text-blue-400">Don't</span> just practice. Pinpoint mistakes.</p>
                                    <p>Fix them and improve your score.</p>
                                </div>

                                <Link href="/login" className="cursor-pointer inline-block px-8 py-3 rounded-lg font-semibold bg-emerald-600 dark:bg-emerald-500 text-white hover:scale-105 transition-transform shadow-lg">
                                    Take Free Diagnostic Test
                                </Link>
                                <p className="mt-4 text-sm italic text-sky-800 dark:text-slate-400">
                                    Discover exactly why your score is stuck
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {children}
            </div >
        </WavyBackground>
    );
};

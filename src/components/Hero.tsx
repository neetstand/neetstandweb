"use client";

import { WavyBackground } from "./WavyBackground";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Sun, Moon, CheckCircle, XCircle, ArrowRight, ArrowUp, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useTheme } from "next-themes";


// Rotating Triangle Component
const RotatingTriangle = ({ isDark, scale = 1 }: { isDark: boolean; scale?: number }) => {
    const [currentFace, setCurrentFace] = useState(0);
    const [rotation, setRotation] = useState(0);

    const faces = [
        {
            text: "I dreamed",
            image: "/hero-stand.png"
        },
        {
            text: "I became a Doctor",
            image: "/hero-brand.png"
        },
        {
            text: "I studied smartly",
            image: "/hero-help.png"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFace((prev) => (prev + 2) % 3);
            setRotation((prev) => prev + 120);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            {/* Rotating Triangle Prism */}
            <div style={{ perspective: '1200px', width: '100%', maxWidth: '400px' }}>
                <div style={{
                    position: 'relative',
                    width: '300px',
                    height: '400px',
                    margin: '0 auto',
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${rotation}deg)`,
                    transition: 'transform 1.5s ease-in-out'
                }}>
                    {faces.map((face, index) => (
                        <div key={index} style={{
                            position: 'absolute',
                            width: '300px',
                            height: '400px',
                            background: `url(${face.image}) center/cover`,
                            backfaceVisibility: 'hidden',
                            transform: `rotateY(${index * 120}deg) translateZ(173px)`,
                            borderRadius: '1rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                            border: `3px solid ${isDark ? '#38bdf8' : '#059669'}`
                        }}>
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: isDark ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' : 'transparent',
                                borderRadius: '1rem'
                            }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Text */}
            <div style={{
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TypewriterText text={faces[currentFace].text} isDark={isDark} key={currentFace} />
            </div>
        </div>
    );
};

// Typewriter Effect Component
const TypewriterText = ({ text, isDark }: { text: string; isDark: boolean }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, 80);
            return () => clearTimeout(timeout);
        } else {
            // Text finished typing, hide cursor after a delay
            const cursorTimeout = setTimeout(() => {
                setShowCursor(false);
            }, 500);
            return () => clearTimeout(cursorTimeout);
        }
    }, [index, text]);

    return (
        <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#0c4a6e',
            textAlign: 'center',
            minHeight: '2.5rem',
            fontStyle: 'italic'
        }}>
            {displayText}
            <span style={{
                animation: 'blink 1s infinite',
                marginLeft: '4px',
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.3s ease'
            }}>|</span>
        </h3>
    );
};


import { motion, useScroll, useTransform } from "framer-motion";

// Helper for scroll animations
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
};

const staggerChildren = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
};

const item = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const Hero = () => {
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
                                    <p className="mb-2"><span className="dark:text-blue-300">Pause</span> blind practice.</p>
                                    <p className="mb-2">Identify your mistakes.</p>
                                    <p>Move forward with NCERT-focused precision.</p>
                                </motion.div>

                                <motion.div variants={item}>
                                    <button className="cursor-pointer px-8 py-4 rounded-lg font-semibold bg-emerald-600 dark:bg-emerald-500 text-white hover:scale-105 transition-transform text-lg shadow-lg">
                                        Take Free Diagnostic Test
                                    </button>
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
                                    <p className="mb-2"><span className="dark:text-blue-400">Pause</span> blind practice. Identify your mistakes.</p>
                                    <p>Move forward with NCERT-focused precision.</p>
                                </div>

                                <button className="cursor-pointer px-8 py-3 rounded-lg font-semibold bg-emerald-600 dark:bg-emerald-500 text-white hover:scale-105 transition-transform shadow-lg">
                                    Take Free Diagnostic Test
                                </button>
                                <p className="mt-4 text-sm italic text-sky-800 dark:text-slate-400">
                                    Discover exactly why your score is stuck
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Problem */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">Why most NEET aspirants feel stuck</h2>
                        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                            <ul className="mb-6 text-sky-800 dark:text-slate-400 space-y-3">
                                <li>• You practice daily</li>
                                <li>• You revise repeatedly</li>
                                <li>• But your score barely moves</li>
                            </ul>
                            <p className="text-lg mb-6">
                                Because NEET doesn't reward <strong>more questions</strong> — it rewards <strong className="text-emerald-600">correcting the right mistakes</strong>.
                            </p>
                            <div className="bg-sky-200 dark:bg-slate-800 p-6 rounded-lg">
                                <p className="text-lg">
                                    Most platforms push you forward.<br />
                                    NEETStand tells you <strong className="text-emerald-600">when to stop and fix things</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Features */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">At NEETStand, you get:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {['Mistake-based question selection', 'NCERT-linked explanations', 'Clear guidance on what to revise next', 'Focus on score improvement, not volume'].map((f, i) => (
                                <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8" key={i}>
                                    <CheckCircle className="text-emerald-600 mb-3" size={32} />
                                    <h3 className="text-xl font-semibold">{f}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="text-center text-lg">
                            <p>No unnecessary difficulty. No syllabus noise.</p>
                            <p className="font-bold text-emerald-600">Only what NEET actually tests.</p>
                        </div>
                    </div>
                </motion.section>

                {/* How It Works */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { num: 1, icon: Target, title: 'Stop & Diagnose', desc: 'Take a diagnostic test to uncover:', list: ['Weak chapters', 'Repeated conceptual errors', 'NCERT gaps'] },
                                { num: 2, icon: BookOpen, title: 'Sit & Practice Smart', desc: 'Practice questions chosen based on your mistakes, not randomly.' },
                                { num: 3, icon: ArrowUp, title: 'Move Forward Confidently', desc: 'After every session, know:', list: ['What to revise today', 'What to stop over-practicing', 'Where your marks are leaking'] }
                            ].map(s => {
                                const Icon = s.icon;
                                return (
                                    <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8 text-center" key={s.num}>
                                        <div className="inline-flex w-16 h-16 bg-emerald-600 text-white rounded-full items-center justify-center text-2xl font-bold mb-4">{s.num}</div>
                                        <Icon className="mx-auto mb-4 text-emerald-600" size={48} />
                                        <h3 className="text-xl font-semibold mb-4">{s.title}</h3>
                                        <p className="text-sky-800 dark:text-slate-400 mb-4">{s.desc}</p>
                                        {s.list && <ul className="text-sky-800 dark:text-slate-400 text-left space-y-2">{s.list.map((l, i) => <li key={i}>• {l}</li>)}</ul>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.section>

                {/* Insight */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">Example feedback you'll see:</h2>
                        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 border-l-4 border-l-orange-600 rounded-xl p-8">
                            <div className="flex gap-4">
                                <TrendingUp className="text-orange-600 flex-shrink-0" size={32} />
                                <div>
                                    <p className="text-lg mb-4 italic">
                                        "You lost 5 marks due to confusion between similar Biology terms. Revise NCERT Chapter 12, paragraph 3-4."
                                    </p>
                                    <p className="font-bold text-emerald-600">This is <strong>direction</strong>, not just analytics.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Who For */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-8 text-center">Who NEETStand Is For</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                                <h3 className="text-2xl mb-6 font-bold text-emerald-600 flex items-center">
                                    <CheckCircle className="mr-3" size={32} />Perfect For
                                </h3>
                                {['Serious NEET aspirants', 'Repeaters aiming for score jump', 'Students tired of random MCQs'].map((t, i) => (
                                    <div key={i} className="flex mb-4 items-center">
                                        <CheckCircle className="text-emerald-600 mr-3 flex-shrink-0" size={20} />
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white dark:bg-slate-700 border border-sky-300 dark:border-slate-600 rounded-xl p-8">
                                <h3 className="text-2xl mb-6 font-bold text-orange-600 flex items-center">
                                    <XCircle className="mr-3" size={32} />Not For
                                </h3>
                                {['Casual browsing', 'Syllabus completion alone'].map((t, i) => (
                                    <div key={i} className="flex mb-4 items-center">
                                        <XCircle className="text-orange-600 mr-3 flex-shrink-0" size={20} />
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Pricing */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Pricing</h2>
                            <p className="text-xl">Affordable. Honest. Value-first.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-slate-700 border-2 border-sky-300 dark:border-slate-600 rounded-xl p-8">
                                <h3 className="text-2xl font-bold mb-2">FREE STAND</h3>
                                <p className="text-sky-800 dark:text-slate-400 mb-6">Perfect to understand your weak areas</p>
                                {['Diagnostic Test', 'Limited daily practice', 'Basic performance summary'].map((f, i) => (
                                    <div key={i} className="flex items-center mb-3">
                                        <CheckCircle className="text-emerald-600 mr-3" size={20} />
                                        {f}
                                    </div>
                                ))}
                                <button className="cursor-pointer w-full mt-4 py-4 rounded-lg font-semibold bg-sky-400 dark:bg-slate-600 text-sky-950 dark:text-slate-100 hover:opacity-90 transition-all">Start Free</button>
                            </div>
                            <div className="bg-white dark:bg-slate-700 border-2 border-emerald-600 rounded-xl p-8 relative">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">Less than one NEET guidebook</div>
                                <h3 className="text-2xl font-bold mb-2">PRO STAND</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-emerald-600">₹599</span>
                                    <span className="text-sky-800 dark:text-slate-400"> / YEAR</span>
                                </div>
                                {['Unlimited mistake-based practice', 'Full NCERT-mapped question bank', 'Chapter-wise mastery tracking', 'Smart revision suggestions', 'Priority feature updates'].map((f, i) => (
                                    <div key={i} className="flex items-center mb-3">
                                        <CheckCircle className="text-emerald-600 mr-3 flex-shrink-0" size={20} />
                                        <span>{f}</span>
                                    </div>
                                ))}
                                <button className="cursor-pointer w-full mt-4 py-4 rounded-lg font-semibold bg-emerald-600 text-white hover:scale-105 transition-transform shadow-lg">Upgrade to Pro</button>
                            </div>
                        </div>
                        <p className="text-center text-sky-800 dark:text-slate-400 mt-8 italic">
                            You pay only after you're confident this helps your preparation.
                        </p>
                    </div>
                </motion.section>

                {/* Final CTA */}
                <motion.section
                    className="py-16 px-6 bg-transparent text-sky-950 dark:text-slate-100"
                    {...fadeInUp}
                >
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8">
                            Start Free. Upgrade Only If You See Improvement.
                        </h2>
                        <button className="cursor-pointer inline-flex items-center gap-3 px-10 py-5 text-xl rounded-lg font-semibold bg-emerald-600 text-white hover:scale-105 transition-transform shadow-lg">
                            <span>Take Free Diagnostic Test</span>
                            <ArrowRight size={24} />
                        </button>
                        <p className="text-sky-800 dark:text-slate-400 mt-6">
                            No credit card required. See results immediately.
                        </p>
                    </div>
                </motion.section>
            </div >
        </WavyBackground>
    );
};

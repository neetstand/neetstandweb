"use client";

import React, { useState, useEffect } from 'react';
import { heroStandBase64, heroBrandBase64, heroHelpBase64 } from './hero-images';

// Typewriter Effect Component
const TypewriterText = ({ text, isDark }: { text: string; isDark: boolean }) => {
    const [displayText, setDisplayText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, 80);
            return () => clearTimeout(timeout);
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
        </h3>
    );
};

// Rotating Triangle Component
export const RotatingTriangle = ({ isDark, scale = 1 }: { isDark: boolean; scale?: number }) => {
    const [currentFace, setCurrentFace] = useState(0);
    const [rotation, setRotation] = useState(0);

    const faces = [
        {
            text: "I dreamed",
            image: heroStandBase64
        },
        {
            text: "I became a Doctor",
            image: heroBrandBase64
        },
        {
            text: "I studied smartly",
            image: heroHelpBase64
        }
    ];

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const INTERVAL_MS = 4000;

        const loop = (time: number) => {
            if (time - lastTime >= INTERVAL_MS) {
                // Ensure we only step once, even if a lot of time has passed (tab in background)
                setCurrentFace((prev) => (prev + 2) % 3);
                setRotation((prev) => prev + 120);
                lastTime = time;
            }
            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
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

"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface RadarData {
    memorization: number;
    understanding: number;
    application: number;
    analysis: number;
}

interface CognitiveRadarChartProps {
    data: RadarData;
    size?: number;
    className?: string;
}

export function CognitiveRadarChart({ data, size = 300, className = "" }: CognitiveRadarChartProps) {
    const margin = 40;
    const radius = Math.min(size, size) / 2 - margin;
    const center = size / 2;

    // Ordered traits. (Top, Right, Bottom, Left)
    const traits = [
        { label: "Memorization", key: "memorization", value: data.memorization },
        { label: "Understanding", key: "understanding", value: data.understanding },
        { label: "Application", key: "application", value: data.application },
        { label: "Analysis", key: "analysis", value: data.analysis },
    ];

    const numPoints = traits.length;

    // Helper to calculate coordinates
    const getCoordinate = (value: number, index: number, maxVal = 100) => {
        // -PI/2 so the 0th point is at the TOP (12 o'clock)
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const normValue = (value / maxVal) * radius;
        return {
            x: center + Math.cos(angle) * normValue,
            y: center + Math.sin(angle) * normValue,
        };
    };

    // Build the path for the data polygon
    const polygonPoints = useMemo(() => {
        return traits.map((t, i) => getCoordinate(t.value, i)).map(p => `${p.x},${p.y}`).join(" ");
    }, [data, radius, center]);

    // Grid polygons (100%, 75%, 50%, 25%)
    const gridLevels = [100, 75, 50, 25];

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* Draw Hex/Diamond Web Grid */}
                {gridLevels.map((level) => {
                    const levelPoints = traits.map((_, i) => getCoordinate(100, i, 100 / (level / 100))).map(p => `${p.x},${p.y}`).join(" ");
                    return (
                        <polygon
                            key={`grid-${level}`}
                            points={levelPoints}
                            fill="none"
                            stroke="currentColor"
                            className="text-gray-200 dark:text-slate-800"
                            strokeWidth={level === 100 ? 1.5 : 1}
                            strokeDasharray={level < 100 ? "4 4" : "none"}
                        />
                    );
                })}

                {/* Draw Axes from center */}
                {traits.map((_, i) => {
                    const edge = getCoordinate(100, i);
                    return (
                        <line
                            key={`axis-${i}`}
                            x1={center}
                            y1={center}
                            x2={edge.x}
                            y2={edge.y}
                            stroke="currentColor"
                            className="text-gray-200 dark:text-slate-700"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Draw the filled Data Polygon (Animated) */}
                <motion.polygon
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                    style={{ transformOrigin: "center" }}
                    points={polygonPoints}
                    className="fill-indigo-500/20 stroke-indigo-500 dark:fill-indigo-400/30 dark:stroke-indigo-400"
                    strokeWidth="3"
                    strokeLinejoin="round"
                />

                {/* Draw Data Points */}
                {traits.map((t, i) => {
                    const pt = getCoordinate(t.value, i);
                    return (
                        <motion.circle
                            key={`pt-${i}`}
                            initial={{ r: 0 }}
                            animate={{ r: 4 }}
                            transition={{ delay: 0.3 }}
                            cx={pt.x}
                            cy={pt.y}
                            className="fill-indigo-600 dark:fill-indigo-300 stroke-white dark:stroke-slate-900 stroke-2"
                        />
                    );
                })}

                {/* Labels */}
                {traits.map((t, i) => {
                    // Position labels slightly outside the 100% boundary
                    const labelOffset = 25;
                    // Need to calculate position with an extended radius
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const lx = center + Math.cos(angle) * (radius + labelOffset);
                    const ly = center + Math.sin(angle) * (radius + labelOffset);

                    // Adjust anchor based on x position to prevent cutoff
                    let textAnchor: "middle" | "start" | "end" = "middle";
                    if (Math.abs(Math.cos(angle)) > 0.1) {
                        textAnchor = Math.cos(angle) > 0 ? "start" : "end";
                    }

                    return (
                        <g key={`label-${i}`}>
                            <text
                                x={lx}
                                y={ly}
                                textAnchor={textAnchor}
                                alignmentBaseline="middle"
                                className="text-xs font-semibold fill-gray-500 dark:fill-slate-400"
                            >
                                {t.label}
                            </text>
                            <text
                                x={lx}
                                y={ly + 14}
                                textAnchor={textAnchor}
                                alignmentBaseline="middle"
                                className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400"
                            >
                                {t.value}%
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

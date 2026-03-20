"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ZoomIn, X, ImageOff } from "lucide-react";

interface ImageCarouselProps {
    images: string[];
    alt?: string;
}

export function ImageCarousel({ images, alt = "Question image" }: ImageCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [failed, setFailed] = useState<Set<number>>(new Set());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && zoomed) {
                setZoomed(false);
            }
        };

        if (zoomed) {
            document.addEventListener("keydown", handleKeyDown);
            // Optionally prevent body scroll underneath
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [zoomed]);


    const prev = useCallback(() => {
        setCurrent((c) => (c - 1 + images.length) % images.length);
    }, [images.length]);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % images.length);
    }, [images.length]);

    const handleImageError = (idx: number) => {
        setFailed((prev) => new Set([...prev, idx]));
    };

    if (images.length === 0) return null;

    const isFailed = failed.has(current);

    const LighboxPortal = () => {
        if (!zoomed || isFailed || !mounted) return null;

        return createPortal(
            <div
                className="practice-carousel__lightbox"
                onClick={() => setZoomed(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Zoomed image"
            >
                <button className="practice-carousel__lightbox-close" aria-label="Close zoom">
                    <X size={24} />
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={images[current]}
                    alt={alt}
                    className="practice-carousel__lightbox-img"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>,
            document.body
        );
    };

    return (
        <>
            {/* ── Carousel ── */}
            <div className="practice-carousel" role="region" aria-label="Question image carousel">
                {/* Image area */}
                <div className="practice-carousel__track">
                    {isFailed ? (
                        <div className="practice-carousel__error">
                            <ImageOff size={32} />
                            <span>Image unavailable</span>
                        </div>
                    ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                            src={images[current]}
                            alt={`${alt} ${images.length > 1 ? `(${current + 1} of ${images.length})` : ""}`}
                            className="practice-carousel__img"
                            loading="lazy"
                            onError={() => handleImageError(current)}
                            onClick={() => setZoomed(true)}
                        />
                    )}

                    {/* Zoom button */}
                    {!isFailed && (
                        <button
                            className="practice-carousel__zoom-btn"
                            onClick={() => setZoomed(true)}
                            aria-label="Zoom image"
                        >
                            <ZoomIn size={16} />
                        </button>
                    )}
                </div>

                {/* Navigation — only when more than 1 image */}
                {images.length > 1 && (
                    <>
                        <button
                            className="practice-carousel__arrow practice-carousel__arrow--prev"
                            onClick={prev}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className="practice-carousel__arrow practice-carousel__arrow--next"
                            onClick={next}
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Dots */}
                        <div className="practice-carousel__dots" role="tablist">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    role="tab"
                                    aria-selected={i === current}
                                    aria-label={`Image ${i + 1}`}
                                    className={`practice-carousel__dot${i === current ? " practice-carousel__dot--active" : ""}`}
                                    onClick={() => setCurrent(i)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Lightbox zoom ── */}
            <LighboxPortal />
        </>
    );
}

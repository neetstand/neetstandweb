"use client";

import { motion } from "framer-motion";

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
};

export const FadeIn = ({
    children,
    className = ""
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.section
            className={className}
            {...fadeInUp}
        >
            {children}
        </motion.section>
    );
};

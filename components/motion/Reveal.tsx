"use client";

import React, { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    yOffset?: number;
    staggerChildren?: number;
}

/**
 * Reveal Component
 * Reusable wrapper for scroll-triggered entrance animations.
 * Features:
 * - Intersection Observer integration (via whileInView)
 * - Automatic Reduced Motion detection
 * - GPU Accelerated (using transform)
 * - Supports staggered children
 */
export const Reveal = ({
    children,
    width = "100%",
    delay = 0,
    duration = 0.5,
    yOffset = 20,
}: RevealProps) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div style={{ width }}>{children}</div>;
    }

    return (
        <div style={{ position: "relative", width, overflow: "visible" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: yOffset },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                    duration,
                    delay,
                    ease: [0.21, 0.47, 0.32, 0.98], // Custom premium ease-out
                }}
                style={{ willChange: "transform, opacity" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const RevealList = ({
    children,
    delay = 0,
    staggerChildren = 0.1,
}: {
    children: ReactNode;
    delay?: number;
    staggerChildren?: number;
}) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                visible: {
                    transition: {
                        delayChildren: delay,
                        staggerChildren: staggerChildren,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
};

export const RevealItem = ({
    children,
    yOffset = 20
}: {
    children: ReactNode;
    yOffset?: number;
}) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: yOffset },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
};

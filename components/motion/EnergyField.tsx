"use client";

import React, { useEffect, useRef } from "react";

interface EnergyFieldProps {
    intensity?: "low" | "medium";
    variant?: "hero" | "section";
}

/**
 * EnergyField Component
 * Renders a high-performance Canvas 2D background with flowing energy streams.
 * Includes safeguards for battery life and performance:
 * - FPS capping to 30fps
 * - IntersectionObserver to pause when off-screen
 * - Visibility API to pause when tab is inactive
 * - dpr clamping to 2x max
 * - Respects prefers-reduced-motion
 */
export const EnergyField: React.FC<EnergyFieldProps> = ({
    intensity = "low",
    variant = "hero",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const isInViewRef = useRef<boolean>(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        // 1. Performance Safeguard: Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        let width = 0;
        let height = 0;
        // Limit pixel ratio to 2 for performance on high-res displays
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener("resize", resize);
        resize();

        // Energy Stream Object
        class Stream {
            x: number = 0;
            y: number = 0;
            length: number = 0;
            speed: number = 0;
            angle: number = 0;
            thickness: number = 0;
            opacity: number = 0;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.length = Math.random() * (variant === 'hero' ? 300 : 150) + 100;
                this.speed = (Math.random() * 0.5 + 0.2) * (intensity === 'medium' ? 1.5 : 1);
                this.angle = Math.random() * Math.PI * 0.2 - 0.1; // Mostly horizontal flow
                this.thickness = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.15 + 0.05;
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                // Wrap around
                if (this.x > width + this.length) this.x = -this.length;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw(context: CanvasRenderingContext2D) {
                const gradient = context.createLinearGradient(
                    this.x, this.y,
                    this.x - this.length, this.y - (this.length * Math.tan(this.angle))
                );

                const color = "139, 92, 246"; // Purple glow
                gradient.addColorStop(0, `rgba(${color}, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(${color}, 0)`);

                context.beginPath();
                context.strokeStyle = gradient;
                context.lineWidth = this.thickness;
                context.lineCap = "round";
                context.moveTo(this.x, this.y);
                context.lineTo(this.x - this.length, this.y - (this.length * Math.tan(this.angle)));
                context.stroke();
            }
        }

        const streamCount = intensity === "medium" ? 25 : 15;
        const streams: Stream[] = Array.from({ length: streamCount }, () => new Stream());

        // 2. Performance Safeguard: FPS Capping (30fps)
        const fps = 30;
        const interval = 1000 / fps;

        const animate = (time: number) => {
            // 3. Performance Safeguard: Stop if off-screen or tab hidden
            if (!isInViewRef.current || document.hidden) {
                requestRef.current = requestAnimationFrame(animate);
                return;
            }

            const delta = time - lastTimeRef.current;

            if (delta > interval) {
                lastTimeRef.current = time - (delta % interval);

                // Clear
                ctx.clearRect(0, 0, width, height);

                // Draw ambient haze blobs
                // Save state for filter
                ctx.save();
                const color = "56, 38, 120"; // Navy-ish purple
                ctx.filter = 'blur(100px)';
                ctx.fillStyle = `rgba(${color}, 0.05)`;
                ctx.beginPath();
                ctx.arc(width * 0.5, height * 0.5, 300, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                streams.forEach((stream) => {
                    stream.update();
                    stream.draw(ctx);
                });
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        // 4. Performance Safeguard: Viewport Observer
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isInViewRef.current = entry.isIntersecting;
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(canvas);

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(requestRef.current);
            observer.disconnect();
        };
    }, [intensity, variant]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-60"
            style={{ zIndex: 0 }}
        />
    );
};

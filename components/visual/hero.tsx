"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bot, ChevronRight, MessageCircle, ArrowRight, Play } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { EnergyField } from '@/components/motion/EnergyField';
import { useRef } from 'react';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const id = href.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `/${locale}${href}`);
            }
        }
    };

    // Scroll parallax setup
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // Subtly translate elements while scrolling
    const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const yBg = useTransform(scrollYProgress, [0, 1], [0, 50]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={targetRef}
            className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden hero-bg-animate"
        >
            {/* Background Parallax Layer */}
            <motion.div
                style={{ y: shouldReduceMotion ? 0 : yBg, opacity: shouldReduceMotion ? 1 : opacityHero }}
                className="absolute inset-0 z-0"
            >
                <EnergyField intensity="low" variant="hero" />

                {/* Logo as Central Light Source */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] z-0 pointer-events-none">
                    {/* Purple Bloom / Glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 logo-bloom scale-150 opacity-40"
                    />

                    {/* Main Logo Watermark */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        animate={{ opacity: 0.08, scale: 1, rotate: 0 }}
                        transition={{ duration: 3, ease: "circOut" }}
                        className="absolute inset-0 flex items-center justify-center mix-blend-screen"
                    >
                        <div className="relative w-full h-full p-20">
                            <Image
                                src="/images/zivra-logo.jpg"
                                alt=""
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                style={{ y: shouldReduceMotion ? 0 : yText, opacity: shouldReduceMotion ? 1 : opacityHero }}
                className="container relative mx-auto px-4 text-center z-10"
            >
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: [0, -8, 0],
                    }}
                    transition={{
                        opacity: { duration: 0.8, ease: "easeOut" },
                        y: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                    {dict.hero.badge}
                </motion.div>

                <div className="relative mx-auto mt-8 flex max-w-[240px] items-center justify-center p-2 rounded-full border border-primary/20 bg-white/50 backdrop-blur-sm shadow-sm">
                    <span className="mr-2 text-sm font-bold text-foreground">{locale === 'ar' ? 'شاهد الديمو' : 'Watch Demo'}</span>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                        <Play size={14} fill="currentColor" />
                    </button>
                </div>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
                >
                    <span dangerouslySetInnerHTML={{ __html: dict.hero.title.replace('<span>', '<span class="text-gradient">').replace('</span>', '</span>') }} />
                    <br />
                    <span className="text-foreground">{dict.hero.subtitle}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed font-medium"
                >
                    {dict.hero.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="h-14 px-10 text-xl font-bold rounded-full group transition-transform hover:scale-[1.05] active:scale-[0.95] shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                        <a
                            href={`/${locale}#contact`}
                            onClick={(e) => handleScroll(e, '#contact')}
                        >
                            {dict.hero.ctaPrimary}
                            <ArrowRight className={`ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 ${locale === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </a>
                    </Button>
                    <Button variant="outline" size="lg" className="h-14 px-10 text-xl font-bold rounded-full group transition-transform hover:scale-[1.05] active:scale-[0.95] text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900" asChild>
                        <a
                            href={`/${locale}/demo`}
                        >
                            <div className="relative w-5 h-5 mr-3 rounded-full overflow-hidden border border-slate-200">
                                <Image
                                    src="/images/zivra-logo.jpg"
                                    alt="ZIVRA"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {dict.hero.ctaSecondary}
                        </a>
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}

"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Bot, ChevronRight } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { EnergyField } from '@/components/motion/EnergyField';

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden hero-bg-animate">
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

                {/* Main Logo Watermark - Crisp and centered */}
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

            <div className="container relative mx-auto px-4 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]"></span>
                    {dict.hero.badge}
                </motion.div>

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
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
                >
                    {dict.hero.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="h-12 px-8 text-lg rounded-full group" asChild>
                        <a href="#pricing">
                            {dict.hero.ctaPrimary}
                            <ChevronRight className={`transition-transform duration-300 group-hover:translate-x-1 ${locale === 'ar' ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2'} h-4 w-4`} />
                        </a>
                    </Button>
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10" asChild>
                        <a href="#ai-chat-trigger">
                            <Bot className={`${locale === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5`} />
                            {dict.hero.ctaSecondary}
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

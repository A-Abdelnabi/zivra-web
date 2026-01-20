"use client";

import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';

export function Trust({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section className="py-12 border-y border-white/5 relative bg-white/[0.01]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-center text-sm text-muted-foreground font-medium tracking-wide">
                        {dict.trust.title}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

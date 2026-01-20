"use client";

import { Locale, Dictionary } from '@/lib/i18n';
import { Reveal } from '@/components/motion/Reveal';

export function Trust({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section className="py-12 border-y border-white/5 relative bg-white/[0.01]">
            <div className="container mx-auto px-4">
                <Reveal yOffset={10}>
                    <p className="text-center text-sm text-muted-foreground font-medium tracking-wide">
                        {dict.trust.title}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Locale } from "@/lib/i18n";

export function StickyCTA({ locale, label }: { locale: Locale; label: string }) {
    const { scrollY } = useScroll();
    const [show, setShow] = React.useState(false);
    const isRtl = locale === 'ar';

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 600) {
            setShow(true);
        } else {
            setShow(false);
        }
    });

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 w-full max-w-xs md:max-w-md"
                >
                    <Button
                        size="lg"
                        className="w-full h-14 rounded-full shadow-[0_20px_40px_rgba(139,92,246,0.3)] bg-primary text-white text-lg font-bold group border border-white/10 backdrop-blur-md"
                        asChild
                    >
                        <a href="#pricing">
                            {label}
                            <ChevronRight className={`transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'mr-2 rotate-180 group-hover:-translate-x-1' : 'ml-2'} h-5 w-5`} />
                        </a>
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

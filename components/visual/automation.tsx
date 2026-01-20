"use client";

import { Bot, MessageCircle, Database, Zap } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';

const iconMap = [Database, MessageCircle, Zap];

export function Automation({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="automation" className="py-20 overflow-hidden relative">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            {dict.automation.title}
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            {dict.automation.title}
          </h2>

          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {dict.automation.subtitle}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.automation.items.map((item, idx) => {
            const Icon = iconMap[idx] || Bot;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="glass-card group p-6 text-left transition-all duration-500 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] relative"
              >
                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="p-2 rounded-lg bg-primary/10"
                  >
                    <Icon className="h-5 w-5 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  </motion.div>
                  <h3 className="font-semibold transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground relative z-10">
                  {item.description}
                </p>

                {/* Subtle border reveal on hover */}
                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all duration-700 rounded-2xl" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
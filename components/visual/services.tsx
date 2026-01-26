"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Code2, Share2, Megaphone, Database, MessageSquare } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Reveal, RevealList, RevealItem } from '@/components/motion/Reveal';

const iconMap = [Bot, MessageSquare, Code2, Share2, Megaphone, Database];

export function Services({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section id="services" className="py-24 bg-muted">
            <div className="container mx-auto px-4">
                <Reveal>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{dict.services.title}</h2>
                        <p className="text-muted-foreground text-lg">
                            {dict.services.subtitle}
                        </p>
                    </div>
                </Reveal>

                <RevealList>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dict.services.items.map((service, index) => {
                            const Icon = iconMap[index];
                            return (
                                <RevealItem key={index}>
                                    <Card className="bg-white group hover:shadow-saas transition-all duration-500 h-full border-slate-100 hover:border-primary/20 hover:-translate-y-1 active:scale-[0.98]">
                                        <CardHeader>
                                            <motion.div
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 relative"
                                            >
                                                {/* Breathing Icon Effect */}
                                                <div className="icon-breathing">
                                                    <Icon className="h-6 w-6 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
                                                </div>

                                                {/* Subtle Glow Bloom on Hover */}
                                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            </motion.div>
                                            <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {service.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </RevealItem>
                            );
                        })}
                    </div>
                </RevealList>
            </div>
        </section>
    );
}

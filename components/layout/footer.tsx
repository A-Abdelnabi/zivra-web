'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale, Dictionary } from '@/lib/i18n';
import { track } from '@/lib/track';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const currentYear = new Date().getFullYear();
    const copyright = dict.footer.copyright.replace('{year}', currentYear.toString());

    return (
        <footer className="border-t border-border bg-muted/50 py-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <Link href={`/${locale}`} className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 transition-transform duration-500 group-hover:rotate-12 border border-border">
                            <Image
                                src="/images/zivra-logo.jpg"
                                alt="ZIVRA Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-tighter leading-none text-foreground">ZIVRA.dev</span>
                            <span className="text-[7px] font-black uppercase tracking-widest text-primary mt-0.5">Zero-Intervention Revenue Automation</span>
                        </div>
                    </Link>
                    <p className="text-sm text-secondary-foreground mt-4 max-w-xs">
                        {dict.footer.tagline}
                    </p>
                </div>

                <nav className="flex gap-8 text-sm text-muted-foreground font-medium">
                    <a href="#contact" onClick={() => track('contact_form_submit', { source: 'footer' })} className="hover:text-primary transition-colors">{dict.footer.contact}</a>
                    <a href="#services" onClick={() => track('pricing_view', { source: 'footer' })} className="hover:text-primary transition-colors">{dict.footer.services}</a>
                    <a href="#pricing" onClick={() => track('pricing_view', { source: 'footer' })} className="hover:text-primary transition-colors">{dict.footer.packages}</a>
                    <span className="hover:text-primary transition-colors cursor-pointer">{dict.footer.privacy}</span>
                    <span className="hover:text-primary transition-colors cursor-pointer">{dict.footer.terms}</span>
                </nav>

                <div className="text-sm text-muted-foreground/80">
                    {copyright}
                </div>
            </div>
        </footer>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale, Dictionary } from '@/lib/i18n';
import { track } from '@/lib/track';

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const currentYear = new Date().getFullYear();
    const copyright = dict.footer.copyright.replace('{year}', currentYear.toString());

    return (
        <footer className="border-t border-white/5 bg-[#0a0a0b] py-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="relative w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden shrink-0">
                            <Image
                                src="/images/zivra-logo.jpg"
                                alt="ZIVRA Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        ZIVRA.dev
                    </Link>
                    <p className="text-sm text-muted-foreground mt-2">
                        {dict.footer.tagline}
                    </p>
                </div>

                <nav className="flex gap-8 text-sm text-muted-foreground">
                    <a href="#contact" onClick={() => track('contact_form_submit', { source: 'footer' })} className="hover:text-foreground transition-colors">{dict.footer.contact}</a>
                    <a href="#services" onClick={() => track('pricing_view', { source: 'footer' })} className="hover:text-foreground transition-colors">{dict.footer.services}</a>
                    <a href="#pricing" onClick={() => track('pricing_view', { source: 'footer' })} className="hover:text-foreground transition-colors">{dict.footer.packages}</a>
                    <span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.privacy}</span>
                    <span className="hover:text-foreground transition-colors cursor-pointer">{dict.footer.terms}</span>
                </nav>

                <div className="text-sm text-muted-foreground">
                    {copyright}
                </div>
            </div>
        </footer>
    );
}

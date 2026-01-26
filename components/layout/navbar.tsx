'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Locale, Dictionary } from '@/lib/i18n';
import { track } from '@/lib/track';

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const pathname = usePathname();

    const navLinks = [
        { name: dict.nav.services, href: `#services` },
        { name: dict.nav.packages, href: `#packages` },
        { name: dict.nav.contact, href: `#contact` },
    ];

    const clearChatStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("zv_sales_lead");
            localStorage.removeItem("zv_sales_msgs");
            localStorage.removeItem("zv_sales_step");
        }
    };

    const switchLocale = (newLocale: Locale) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        return segments.join('/');
    };

    const handleLocaleSwitch = (e: React.MouseEvent<HTMLAnchorElement>, newLocale: Locale) => {
        e.preventDefault();
        clearChatStorage();
        const newPath = switchLocale(newLocale);
        window.location.href = newPath;
    };

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

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#F8FBFA]/80 backdrop-blur-lg border-b border-white/50 shadow-sm shadow-[#8EEAD4]/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2 group">
                    <div className="relative w-[36px] h-[36px] md:w-[42px] md:h-[42px] rounded-full overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110">
                        <Image
                            src="/images/zivra-logo.jpg"
                            alt="ZIVRA Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col -gap-1">
                        <span className="font-bold text-xl md:text-2xl tracking-tighter leading-none">ZIVRA</span>
                        <span className="hidden md:block text-[8px] font-black uppercase tracking-[0.2em] text-primary">Zero-Intervention Revenue Automation</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={`/${locale}${link.href}`}
                            onClick={(e) => handleScroll(e, link.href)}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="flex items-center gap-1 border border-slate-200 rounded-full overflow-hidden bg-white">
                        <a
                            href={switchLocale('en')}
                            onClick={(e) => handleLocaleSwitch(e, 'en')}
                            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 transition-colors ${locale === 'en'
                                ? 'bg-slate-100 text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            EN
                        </a>
                        <a
                            href={switchLocale('ar')}
                            onClick={(e) => handleLocaleSwitch(e, 'ar')}
                            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 transition-colors ${locale === 'ar'
                                ? 'bg-slate-100 text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            AR
                        </a>
                        <a
                            href={switchLocale('fi')}
                            onClick={(e) => handleLocaleSwitch(e, 'fi')}
                            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 transition-colors ${locale === 'fi'
                                ? 'bg-slate-100 text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            FI
                        </a>
                    </div>
                    <Button size="sm" asChild>
                        <a
                            href={`/${locale}/signup`}
                            onClick={() => track('book_demo_click', { source: 'header_cta', language: locale })}
                        >
                            {dict.hero.ctaPrimary}
                        </a>
                    </Button>
                </div>

                {/* Mobile Nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={locale === 'ar' ? 'left' : 'right'}>
                        <h2 className="sr-only">Navigation</h2>
                        <div className="flex flex-col gap-8 mt-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={`/${locale}${link.href}`}
                                    onClick={(e) => handleScroll(e, link.href)}
                                    className="text-lg font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}

                            {/* Mobile Language Switcher */}
                            <div className="flex gap-2">
                                <a
                                    href={switchLocale('en')}
                                    onClick={(e) => handleLocaleSwitch(e, 'en')}
                                    className={`flex-1 text-center py-2 px-4 rounded-lg border transition-colors ${locale === 'en'
                                        ? 'bg-slate-100 border-slate-200 text-foreground'
                                        : 'border-slate-100 hover:border-slate-200 text-muted-foreground'
                                        }`}
                                >
                                    English
                                </a>
                                <a
                                    href={switchLocale('ar')}
                                    onClick={(e) => handleLocaleSwitch(e, 'ar')}
                                    className={`flex-1 text-center py-2 px-4 rounded-lg border transition-colors ${locale === 'ar'
                                        ? 'bg-slate-100 border-slate-200 text-foreground'
                                        : 'border-slate-100 hover:border-slate-200 text-muted-foreground'
                                        }`}
                                >
                                    العربية
                                </a>
                                <a
                                    href={switchLocale('fi')}
                                    onClick={(e) => handleLocaleSwitch(e, 'fi')}
                                    className={`flex-1 text-center py-2 px-4 rounded-lg border transition-colors ${locale === 'fi'
                                        ? 'bg-slate-100 border-slate-200 text-foreground'
                                        : 'border-slate-100 hover:border-slate-200 text-muted-foreground'
                                        }`}
                                >
                                    Suomi
                                </a>
                            </div>

                            <Button className="w-full" asChild>
                                <a
                                    href={`/${locale}#contact`}
                                    onClick={(e) => handleScroll(e, '#contact')}
                                >
                                    {dict.nav.getStarted}
                                </a>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Disc, Menu, Globe } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet'

export function Navbar() {
    const navLinks = [
        { name: 'Services', href: '#services' },
        { name: 'Packages', href: '#pricing' },
        { name: 'Contact', href: '#contact' },
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <Disc className="h-6 w-6 text-primary" />
                    ZIVRA
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground border border-white/10 rounded-full px-3 py-1">
                        <Globe className="h-3 w-3" />
                        <span>EN</span>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="#contact">Get Started</Link>
                    </Button>
                </div>

                {/* Mobile Nav */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                   <SheetContent side="right">
<h2 className="sr-only">Navigation</h2>
                        <div className="flex flex-col gap-8 mt-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lg font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex items-center gap-4">
                                <Button className="w-full">Get Started</Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

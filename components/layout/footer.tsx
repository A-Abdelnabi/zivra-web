import Link from 'next/link'
import Image from 'next/image'
import { Disc } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0a0a0b] py-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
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
                        Websites • Apps • AI • Management
                    </p>
                </div>

                <nav className="flex gap-8 text-sm text-muted-foreground">
                    <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
                    <Link href="#services" className="hover:text-foreground transition-colors">Services</Link>
                    <Link href="#pricing" className="hover:text-foreground transition-colors">Packages</Link>
                    <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
                    <span className="hover:text-foreground transition-colors cursor-pointer">Terms</span>
                </nav>

                <div className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} ZIVRA. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

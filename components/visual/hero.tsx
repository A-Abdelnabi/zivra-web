import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, ChevronRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 blur-[100px] rounded-full pointer-events-none opacity-30" />

            {/* Logo Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-[0.05] pointer-events-none select-none z-0 mix-blend-screen">
                <Image
                    src="/images/zivra-logo.jpg"
                    alt=""
                    fill
                    className="object-contain"
                />
            </div>

            <div className="container relative mx-auto px-4 text-center">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse shadow-glow"></span>
                    AI + Automation Studio
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    Build. Automate. <span className="text-gradient">Scale.</span>
                    <br />
                    <span className="text-foreground">Websites, Apps & AI Systems.</span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8">
                    We build high-end websites and apps — and automate your business with AI workflows (n8n), chatbots, integrations, and lead follow-up.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-300">
                    <Button size="lg" className="h-12 px-8 text-lg rounded-full" asChild>
                        <Link href="#pricing">
                            Get Started <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-lg rounded-full" asChild>
                        <Link href="#ai-chat-trigger">
                            <Bot className="mr-2 h-5 w-5" />
                            Talk to AI Assistant
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

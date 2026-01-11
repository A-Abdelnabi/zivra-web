import { Cpu, Globe, Rocket, ShieldCheck } from 'lucide-react'

const features = [
    {
        icon: Rocket,
        title: 'Fast & Modern',
        description: 'Built with the latest tech stack for speed and SEO.'
    },
    {
        icon: Cpu,
        title: 'AI-Powered',
        description: 'Integrated AI automation and chatbots.'
    },
    {
        icon: Globe,
        title: 'Multilingual',
        description: 'Ready for English, Arabic, Finnish, and more.'
    },
    {
        icon: ShieldCheck,
        title: 'Fully Managed',
        description: 'We handle updates, security, and hosting.'
    }
]

export function Trust() {
    return (
        <section className="py-12 border-y border-white/5 bg-transparent backdrop-blur-[2px]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

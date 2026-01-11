import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppWindow, Bot, Code2, Settings2 } from 'lucide-react'

const services = [
    {
        icon: Code2,
        title: 'Website Development',
        description: 'Fast, modern, and responsive websites. From landing pages to complex corporate sites, built for SEO and speed.'
    },
    {
        icon: AppWindow,
        title: 'Web Application',
        description: 'Custom dashboards, admin panels, and SaaS products. We build robust tools to run your business.'
    },
    {
        icon: Bot,
        title: 'AI Chatbots',
        description: '24/7 customer support, lead generation, and sales assistants trained specifically on your business data.'
    },
    {
        icon: Settings2,
        title: 'Full Management',
        description: "Relax while we handle everything. Updates, content changes, security monitoring, and hosting."
    }
]

export function Services() {
    return (
        <section id="services" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">What We Build</h2>
                    <p className="text-muted-foreground text-lg">
                        We don't just write code – we build digital engines for your business growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <Card key={index} className="glass-card hover:bg-white/5 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <service.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

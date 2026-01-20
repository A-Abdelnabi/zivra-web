import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppWindow, Bot, Code2, Settings2 } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';

const iconMap = [Code2, AppWindow, Bot, Settings2];

export function Services({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section id="services" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{dict.services.title}</h2>
                    <p className="text-muted-foreground text-lg">
                        {dict.services.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dict.services.items.map((service, index) => {
                        const Icon = iconMap[index];
                        return (
                            <Card key={index} className="glass-card hover:bg-white/5 transition-colors">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

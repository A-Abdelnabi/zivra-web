import { Locale, Dictionary } from '@/lib/i18n';

export function Trust({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    return (
        <section className="py-12 border-y border-white/5">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground">
                    {dict.trust.title}
                </p>
            </div>
        </section>
    );
}

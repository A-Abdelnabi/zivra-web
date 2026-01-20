import { Bot, MessageCircle, Database, Zap } from 'lucide-react';
import { Locale, Dictionary } from '@/lib/i18n';

const iconMap = [Database, MessageCircle, Zap];

export function Automation({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section id="automation" className="py-20">
      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium">
            {dict.automation.title}
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            {dict.automation.title}
          </h2>

          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {dict.automation.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {dict.automation.items.map((item, idx) => {
            const Icon = iconMap[idx] || Bot;
            return (
              <div
                key={item.title}
                className="glass-card group p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
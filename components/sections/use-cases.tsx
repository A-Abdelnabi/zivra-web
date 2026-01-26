"use client";

import { Reveal, RevealList, RevealItem } from "@/components/motion/Reveal";
import { Locale, Dictionary } from "@/lib/i18n";
import { Magnet, TrendingUp, Megaphone, Zap, ArrowRight } from "lucide-react";

export default function UseCases({ locale }: { locale: Locale; dict: Dictionary }) {
    const isRtl = locale === 'ar';

    const t = (en: string, ar: string, fi: string) => {
        if (locale === 'ar') return ar;
        if (locale === 'fi') return fi;
        return en;
    };

    const cases = [
        {
            id: "leads",
            icon: <Magnet className="text-secondary" size={24} />,
            title: t("Lead-Driven Businesses", "شركات تعتمد على العملاء المحتملين", "Liidivetoiset yritykset"),
            problem: t(
                "Leads come from many channels, but nothing is organized.",
                "العملاء يأتون من قنوات كثيرة بدون تنظيم واضح.",
                "Liidejä tulee monista kanavista, mutta mikään ei ole organisoitua."
            ),
            solution: t(
                "ZIVRA centralizes all leads from ads, WhatsApp, website, and social media into one automated sales system.",
                "ZIVRA تجمع كل العملاء من الإعلانات، واتساب، الموقع، والسوشيال ميديا في نظام مبيعات واحد.",
                "ZIVRA keskittää kaikki liidit mainoksista, WhatsAppista, verkkosivuilta ja somesta yhteen automatisoituun myyntijärjestelmään."
            ),
            result: t(
                "Higher conversion, faster response, zero missed opportunities.",
                "تحويل أعلى، رد أسرع، وعدم ضياع أي فرصة.",
                "Parempi konversio, nopeampi vastaus, nolla menetettyä mahdollisuutta."
            ),
            color: "from-secondary/10 to-transparent"
        },
        {
            id: "sales",
            icon: <TrendingUp className="text-primary" size={24} />,
            title: t("Sales Teams & Growth Companies", "فرق مبيعات وشركات في مرحلة نمو", "Myyntitiimit ja kasvuyritykset"),
            problem: t(
                "Sales performance depends on people, not systems.",
                "المبيعات تعتمد على الأفراد وليس الأنظمة.",
                "Myynnin tulos riippuu ihmisistä, ei järjestelmistä."
            ),
            solution: t(
                "AI-assisted sales flows, CRM pipelines, automated follow-ups, and performance tracking.",
                "مبيعات مدعومة بالذكاء الاصطناعي، CRM، متابعات تلقائية، ولوحات تحكم.",
                "Tekoälyavusteiset myyntiputket, CRM, automaattiset seurannat ja suorituskyvyn seuranta."
            ),
            result: t(
                "More closed deals, shorter sales cycles, full sales visibility.",
                "صفقات أكثر، دورة بيع أقصر، ورؤية كاملة للإدارة.",
                "Enemmän kauppoja, lyhyemmät myyntisyklit, täysi näkyvyys myyntiin."
            ),
            color: "from-primary/10 to-transparent"
        },
        {
            id: "marketing",
            icon: <Megaphone className="text-secondary" size={24} />,
            title: t("Marketing-Heavy Companies", "شركات تعتمد على التسويق والإعلانات", "Markkinointivetoiset yritykset"),
            problem: t(
                "We spend on ads but don’t know what actually converts.",
                "نصرف على الإعلانات بدون معرفة ما الذي يحقق نتائج حقيقية.",
                "Käytämme rahaa mainoksiin, mutta emme tiedä mikä oikeasti tuottaa tulosta."
            ),
            solution: t(
                "ZIVRA connects media buying, landing pages, AI chat, and CRM into one measurable funnel.",
                "ZIVRA تربط الإعلانات، الصفحات، الشات الذكي، وCRM في Funnel واحد قابل للقياس.",
                "ZIVRA yhdistää mediamyynnin, laskeutumissivut, tekoälychatin ja CRM:n yhdeksi mitattavaksi suppiloksi."
            ),
            result: t(
                "Better ROI, clear attribution, scalable growth.",
                "عائد أعلى، تتبع أوضح، ونمو قابل للتوسع.",
                "Parempi ROI, selkeä attribuutio, skaalautuva kasvu."
            ),
            color: "from-secondary/10 to-transparent"
        },
        {
            id: "automation",
            icon: <Zap className="text-primary" size={24} />,
            title: t("Operationally Busy Businesses", "شركات تعاني من ضغط تشغيلي", "Operatiivisesti kiireiset yritykset"),
            problem: t(
                "Too many messages, follow-ups, and manual tasks.",
                "رسائل كثيرة، متابعات يدوية، وضغط يومي.",
                "Liikaa viestejä, seurantoja ja manuaalisia tehtäviä."
            ),
            solution: t(
                "Automation for lead routing, reminders, customer support, and internal workflows.",
                "أتمتة التوجيه، المتابعات، دعم العملاء، والعمليات الداخلية.",
                "Automaatio liidien ohjaukseen, muistutuksiin, asiakastukeen ja sisäisiin työnkulkuihin."
            ),
            result: t(
                "Less workload, fewer hires, more focus on growth.",
                "مجهود أقل، توظيف أقل، وتركيز أكبر على النمو.",
                "Vähemmän työkuormaa, vähemmän rekrytointeja, enemmän fokusta kasvuun."
            ),
            color: "from-primary/10 to-transparent"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="container mx-auto px-4 max-w-6xl">
                <Reveal>
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                            {t("Who ZIVRA is built for", "لمن تم بناء ZIVRA", "Kenelle ZIVRA on tehty")}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                            {t(
                                "Companies that want predictable growth, automated sales, and full visibility — without chaos.",
                                "للشركات التي تبحث عن نمو مستدام، مبيعات مؤتمتة، ورؤية كاملة بدون فوضى.",
                                "Yrityksille, jotka haluavat ennustettavaa kasvua, automatisoitua myyntiä ja täydellistä näkyvyyttä – ilman kaaosta."
                            )}
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RevealList delay={0.2} staggerChildren={0.1}>
                        {cases.map((c) => (
                            <RevealItem key={c.id}>
                                <div className={`relative group p-8 rounded-3xl border border-border bg-white hover:shadow-saas transition-all duration-500 h-full hover:border-primary/30 shadow-sm shadow-border/50`}>
                                    <div className="mb-6 p-4 bg-primary/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 text-primary">
                                        {c.icon}
                                    </div>

                                    <h3 className="text-xl font-bold mb-6 text-foreground">{c.title}</h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                                                {t("Problem", "المشكلة", "Ongelma")}
                                            </span>
                                            <p className="text-sm text-secondary-foreground leading-relaxed italic">
                                                "{c.problem}"
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-bold">
                                                {t("Solution", "الحل", "Ratkaisu")}
                                            </span>
                                            <p className="text-sm text-foreground leading-relaxed font-semibold">
                                                {c.solution}
                                            </p>
                                        </div>

                                        <div className="pt-6 border-t border-border mt-auto">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-1 bg-primary rounded-full" />
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-widest text-primary/80 font-bold block">
                                                        {t("Expected Result", "النتيجة المتوقعة", "Odotettu tulos")}
                                                    </span>
                                                    <p className="text-base font-bold text-foreground">
                                                        {c.result}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </RevealItem>
                        ))}
                    </RevealList>
                </div>

                <Reveal delay={0.8}>
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95"
                        >
                            {t("Book Sales Strategy", "احجز استراتيجية مبيعات", "Varaa myyntistrategia")}
                            <ArrowRight size={18} className={`${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                        </button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}



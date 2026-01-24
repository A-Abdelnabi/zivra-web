import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import Providers from "@/components/providers";
import ChatWidget from "@/components/chat/chat-widget";
import WhatsAppButton from "@/components/whatsapp-button";
import LeadCapture from "@/components/lead-capture";
import { Locale, locales, getDirection } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });
import { getDictionary } from "@/lib/i18n";
import { StickyCTA } from "@/components/visual/sticky-cta";

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const title = locale === 'ar' ? 'ZIVRA | نبني. نطلق. ندير.' : 'ZIVRA | Build. Launch. Manage.';
    const description = locale === 'ar'
        ? 'مواقع، تطبيقات وذكاء اصطناعي — كل شيء في مكان واحد.'
        : 'Websites, Apps & AI — All in One Place.';

    return {
        title,
        description,
        alternates: {
            canonical: `/${locale}`,
            languages: {
                'en': '/en',
                'ar': '/ar',
            },
        },
        openGraph: {
            title,
            description,
            locale: locale === 'ar' ? 'ar_SA' : 'en_US',
            alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const dir = getDirection(locale);
    const fontClass = locale === 'ar' ? cairo.variable : inter.variable;

    return (
        <html lang={locale} dir={dir} className="dark">
            <head>
                {/* Google Analytics */}
                {process.env.NEXT_PUBLIC_GA4_ID && (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
                                        page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
            </head>
            <body className={`${fontClass} ${locale === 'ar' ? 'font-cairo' : 'font-inter'} min-h-screen bg-background text-foreground antialiased pb-28`}>
                <Providers>
                    {children}

                    {/* Floating Widgets */}
                    <WhatsAppButton locale={locale} />
                    <ChatWidget key={`chat-${locale}`} locale={locale} />
                    <LeadCapture locale={locale} />
                    <StickyCTA locale={locale} label={(await getDictionary(locale)).hero.ctaPrimary} />
                </Providers>
            </body>
        </html>
    );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validators/contact';
import { submitContactForm } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { Locale, Dictionary } from '@/lib/i18n';
import { Reveal } from '@/components/motion/Reveal';
import { track } from '@/lib/track';

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
            service: '',
            platforms: [],
        },
    });

    const selectedService = form.watch('service');

    async function onSubmit(data: ContactFormData) {
        setIsSubmitting(true);
        const leadData = {
            name: data.name,
            email: data.email,
            businessType: data.service,
            service: data.service,
            phone: "", // Not in basic contact form usually
            source: 'contact_form' as const,
            notes: `Message: ${data.message}${data.platforms?.length ? ` | Platforms: ${data.platforms.join(', ')}` : ''}`,
        };

        try {
            track('contact_form_submit', { source: 'form_main', language: locale, ...data });
            // Submit to existing action
            await submitContactForm(data);
            // Also submit to leads API for CRM
            await fetch('/api/leads', {
                method: 'POST',
                body: JSON.stringify(leadData)
            });
            setSuccess(true);
            form.reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center animate-in fade-in max-w-2xl mx-auto my-24">
                <h3 className="text-2xl font-bold mb-2">{dict.contact.form.success}</h3>
                <p className="text-muted-foreground mb-6">
                    {locale === 'ar'
                        ? 'شكراً على تواصلك. سيرد عليك فريقنا خلال 24 ساعة.'
                        : 'Thanks for reaching out. Our team will get back to you within 24 hours.'}
                </p>
                <Button variant="outline" onClick={() => setSuccess(false)}>
                    {locale === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
                </Button>
            </div>
        );
    }

    const socPlatforms = [
        { id: 'instagram', name: locale === 'ar' ? 'انستقرام' : 'Instagram' },
        { id: 'tiktok', name: locale === 'ar' ? 'تيك توك' : 'TikTok' },
        { id: 'snapchat', name: locale === 'ar' ? 'سناب شات' : 'Snapchat' },
        { id: 'x', name: locale === 'ar' ? 'X (تويتر)' : 'X (Twitter)' },
        { id: 'linkedin', name: locale === 'ar' ? 'لينكد إن' : 'LinkedIn' },
    ];

    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-4 max-w-2xl">
                <Reveal>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{dict.contact.title}</h2>
                        <p className="text-muted-foreground text-lg">
                            {dict.contact.subtitle}
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="glass-card p-6 md:p-8 rounded-2xl border-white/5 shadow-xl">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{dict.contact.form.name}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={locale === 'ar' ? 'اكتب اسمك هنا' : 'Your name here'}
                                                        className={`transition-all focus:scale-[1.01] ${locale === 'ar' ? 'text-right' : ''}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{dict.contact.form.email}</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="email@example.com"
                                                        type="email"
                                                        dir="ltr"
                                                        className="transition-all focus:scale-[1.01]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="service"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{dict.contact.form.service}</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className={`w-full h-10 px-3 rounded-md border border-white/10 bg-white/5 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none ${locale === 'ar' ? 'text-right' : ''}`}
                                                >
                                                    <option value="" disabled className="bg-[#0a0a0c]">{dict.contact.form.servicePlaceholder}</option>
                                                    {dict.contact.services.map((s: string) => (
                                                        <option key={s} value={s} className="bg-[#0a0a0c]">{s}</option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {(selectedService === "Social Media Growth" || selectedService === "نمو السوشيال ميديا") && (
                                    <div className="space-y-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 animate-in slide-in-from-top-2 duration-300">
                                        <p className={`text-sm font-medium ${locale === 'ar' ? 'text-right' : ''}`}>
                                            {locale === 'ar' ? 'اختار المنصات المستهدفة:' : 'Selected Platforms:'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {socPlatforms.map((plat) => {
                                                const currentPlats = form.getValues('platforms') || [];
                                                const isSelected = currentPlats.includes(plat.id);
                                                return (
                                                    <button
                                                        key={plat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const newValue = isSelected
                                                                ? currentPlats.filter((i) => i !== plat.id)
                                                                : [...currentPlats, plat.id];
                                                            form.setValue('platforms', newValue);
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs transition-all border ${isSelected
                                                            ? "bg-blue-600 border-blue-400 text-white"
                                                            : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                                            }`}
                                                    >
                                                        {plat.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{dict.contact.form.message}</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={locale === 'ar'
                                                        ? 'فضفض لنا عن مشروعك...'
                                                        : 'Tell us about your project...'}
                                                    className={`min-h-[120px] transition-all focus:scale-[1.01] ${locale === 'ar' ? 'text-right' : ''}`}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full transition-transform active:scale-[0.98] h-12 text-lg font-bold"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? dict.contact.form.submitting : dict.contact.form.submit}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

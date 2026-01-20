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
import { useState } from 'react';
import { Locale, Dictionary } from '@/lib/i18n';

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    async function onSubmit(data: ContactFormData) {
        setIsSubmitting(true);
        try {
            await submitContactForm(data);
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
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center animate-in fade-in">
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

    return (
        <section id="contact" className="py-24">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">{dict.contact.title}</h2>
                    <p className="text-muted-foreground text-lg">
                        {dict.contact.subtitle}
                    </p>
                </div>

                <div className="glass-card p-6 md:p-8 rounded-2xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dict.contact.form.name}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={locale === 'ar' ? 'محمد أحمد' : 'John Doe'}
                                                className={locale === 'ar' ? 'text-right' : ''}
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
                                                placeholder={locale === 'ar' ? 'email@example.com' : 'john@example.com'}
                                                type="email"
                                                dir="ltr"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{dict.contact.form.message}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={locale === 'ar'
                                                    ? 'أحتاج موقع لمطعمي...'
                                                    : 'I need a website for my restaurant...'}
                                                className={`min-h-[120px] ${locale === 'ar' ? 'text-right' : ''}`}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? dict.contact.form.submitting : dict.contact.form.submit}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </section>
    );
}

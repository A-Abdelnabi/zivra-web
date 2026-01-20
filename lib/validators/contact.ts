import { z } from 'zod'

export const contactSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
    service: z.string().optional(),
    platforms: z.array(z.string()).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>

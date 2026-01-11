'use server'

import { ContactFormData } from "@/lib/validators/contact"

export async function submitContactForm(data: ContactFormData) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log('Form Submitted:', data)

    return { success: true, message: "Thanks! We'll be in touch shortly." }
}

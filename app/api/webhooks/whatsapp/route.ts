import { aiService } from "@/lib/services/ai-service"

// This is a simplified handler. In production, this would verify signatures.
export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log("[WhatsApp Webhook] Received:", JSON.stringify(body, null, 2))

        // 1. Extract Message (Meta Graph API structure)
        const entry = body.entry?.[0]
        const changes = entry?.changes?.[0]
        const value = changes?.value
        const message = value?.messages?.[0]

        if (message?.type === 'text') {
            const userText = message.text.body
            const sender = message.from // Phone number

            // 2. Process with AI (Async - do not await in real prod if slow)
            // For this demo, we await to see logs or errors.
            const aiResponse = await aiService.processHostMessage(userText, { channel: 'whatsapp', user: sender })

            console.log(`[WhatsApp AI Reply] To ${sender}: ${aiResponse.content}`)

            // 3. TODO: Send reply back via Meta Graph API
            // await sendWhatsAppMessage(sender, aiResponse.content)
        }

        return new Response('OK', { status: 200 })
    } catch (error) {
        console.error("[WhatsApp Webhook] Error:", error)
        return new Response('Internal Server Error', { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_SECRET || 'zivra_secret'

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 })
    }

    return new Response('Forbidden', { status: 403 })
}

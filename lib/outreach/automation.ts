import { Lead, OutreachChannel } from "./types";
import { updateLeadStatus } from "./store";
import { WHATSAPP_OUTREACH, EMAIL_OUTREACH, DEMO_RESPONSE } from "./templates";

export async function triggerOutreach(lead: Lead, channel: OutreachChannel): Promise<boolean> {
    // 1. Compliance Check (PDPL Rule: One message only unless replied)
    if (lead.history.lastContactedAt && !lead.history.lastRepliedAt) {
        console.warn(`[Compliance Lock] Lead ${lead.id} already contacted. Blocking dual-outreach.`);
        return false;
    }

    // 2. Format Message based on Channel & Lead Data
    const lang = lead.city ? 'ar' : 'en'; // Simple heuristic for now
    const template = channel === 'whatsapp' ? WHATSAPP_OUTREACH : EMAIL_OUTREACH;
    const body = template[lang].body.replace('[Restaurant Name]', lead.name).replace('[اسم المطعم]', lead.name);

    // 3. Simulated API Call (Integration with Twilio/SendGrid/n8n would go here)
    console.log(`[Outreach Engine] Sending to ${lead.name} via ${channel.toUpperCase()}...`);
    console.log(`[Message Content]: ${body}`);

    // 4. Update Status
    updateLeadStatus(lead.id, 'contacted', `Sent ${channel} outreach.`);
    return true;
}

export async function handleResponse(lead: Lead, isPositive: boolean) {
    if (isPositive) {
        updateLeadStatus(lead.id, 'demo', 'High intent: Requested demo.');
        // Trigger automated demo response
        const lang = lead.city ? 'ar' : 'en';
        console.log(`[Outreach Engine] Triggering DEMO response for ${lead.name}...`);
        console.log(`[Message Content]: ${DEMO_RESPONSE[lang].body}`);
    } else {
        updateLeadStatus(lead.id, 'archived', 'Not interested.');
    }
}

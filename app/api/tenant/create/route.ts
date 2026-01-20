import { NextResponse } from "next/server";
import { SignupState } from "@/lib/signup/types";
import { addLead, updateLeadStatus } from "@/lib/outreach/store";

export async function POST(req: Request) {
    try {
        const body: SignupState = await req.json();

        // 1. Create Lead in CRM store
        const lead = addLead({
            name: body.businessName,
            city: body.city,
            source: (body.source as any) || 'website',
            contact: {
                whatsapp: body.whatsapp,
                email: body.email
            },
            socials: {
                website: "" // Could be inferred
            },
            qualification: {
                hasWebsite: true, // They are signing up so we assume intent
                hasOrdering: false,
                hasWhatsApp: true,
                estimatedSize: 'medium'
            }
        });

        // 2. Set Status based on intention
        if (body.paymentMode === 'later') {
            updateLeadStatus(lead.id, 'demo', `Self-signup Trial. Plan: ${body.selectedPlanId}`);
        } else {
            updateLeadStatus(lead.id, 'contacted', `Self-signup Started Payment. Plan: ${body.selectedPlanId}`);
        }

        // 3. Simulated external tenant creation (would call DB in production)
        console.log(`[Tenant Activation] Created Tenant for ${body.businessName}. Mode: ${body.paymentMode}`);

        // 4. Trigger parallel notifications (Owner + Sales)
        try {
            const apiBase = new URL(req.url).origin;
            await Promise.all([
                // Alert Sales
                fetch(`${apiBase}/api/notify/whatsapp`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'HOT_LEAD',
                        data: { ...body, leadId: lead.id }
                    })
                }),
                // Welcome Client
                fetch(`${apiBase}/api/notify/whatsapp`, {
                    method: 'POST',
                    body: JSON.stringify({
                        type: 'WELCOME',
                        data: { ...body, leadId: lead.id }
                    })
                })
            ]);
        } catch (e) {
            console.error("Notification trigger failed", e);
        }

        return NextResponse.json({ success: true, leadId: lead.id });
    } catch (error) {
        console.error("Tenant creation error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { appendLeadRow } from '@/lib/googleSheets';

export const runtime = 'nodejs';

const leadSchema = z.object({
    name: z.string().optional(),
    businessType: z.string().optional(),
    service: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    source: z.enum(['chat', 'contact_form', 'demo_form', 'unknown']),
    notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = leadSchema.parse(body);

        // Spam protection: Reject if all of name/phone/email are empty
        if (!validatedData.name?.trim() && !validatedData.phone?.trim() && !validatedData.email?.trim()) {
            console.warn('[Leads API] Rejected lead: All contact info empty', body);
            return NextResponse.json({ ok: false, error: 'Empty contact info' }, { status: 400 });
        }

        await appendLeadRow(validatedData);

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('[Leads API] Error processing lead:', error);
        return NextResponse.json({ ok: false, error: error?.message || 'Internal Server Error' }, { status: 500 });
    }
}

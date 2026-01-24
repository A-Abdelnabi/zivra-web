import { google } from 'googleapis';

export interface LeadPayload {
    name?: string;
    businessType?: string;
    service?: string;
    phone?: string;
    email?: string;
    source: 'chat' | 'contact_form' | 'demo_form' | 'unknown';
    notes?: string;
}

export async function appendLeadRow(payload: LeadPayload) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1QsBDuZh65L325vYirYM42lJXb63BqPeCeqi-55u41nA';
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error('Missing Google Service Account credentials');
    }

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
        [
            new Date().toLocaleString('en-GB', { timeZone: 'UTC' }) + ' UTC',
            payload.name || '',
            payload.businessType || '',
            payload.service || '',
            payload.phone || '',
            payload.email || '',
            payload.source,
            payload.notes || '',
        ],
    ];

    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return response;
    } catch (error) {
        console.error('Error appending to Google Sheets:', error);
        throw error;
    }
}

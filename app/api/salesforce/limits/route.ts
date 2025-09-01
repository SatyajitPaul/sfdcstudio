import { NextRequest, NextResponse } from 'next/server';

// Salesforce Organization Limits API
export async function POST(request: NextRequest) {
    try {
        const { session } = await request.json();

        if (!session?.accessToken || !session?.instanceUrl) {
            return NextResponse.json(
                { error: 'No valid Salesforce session found' },
                { status: 401 }
            );
        }

        const apiUrl = `${session.instanceUrl}/services/data/v60.0/limits/`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    error: `Salesforce API Error: ${response.status} - ${errorData.message || response.statusText}`,
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Salesforce limits API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
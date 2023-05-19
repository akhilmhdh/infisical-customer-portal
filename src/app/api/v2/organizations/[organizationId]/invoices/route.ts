import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import {
    STRIPE_SECRET_KEY,
    DB_MAIN
} from '@/app/api/config';

interface Invoice {
    id: string;
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
        
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const { data, has_more, url } = await stripe.invoices.list({
            customer: organization.customerId
        });
        
        return jsonResponse(200, {
            invoices: []
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization invoices.'
            }
        });
    }
}
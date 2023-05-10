import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { 
    STRIPE_SECRET_KEY,
    SITE_URL,
    MONGO_MAIN_DB_URI,
    DB_MAIN
} from'@/app/api/config';

export async function GET(request: NextRequest) {
    try {
        console.log('get cloud plans');

        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const { data } = await stripe.subscriptions.list({
			customer: organization.customerId
		});
        
        // TODO: transform data
        
        console.log('gack');
        
        return jsonResponse(200, {
            cloudPlans: data
        });

    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization cloud plan'
            }
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        // "update" plan
        
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];

        await dbConnect(DB_MAIN);
        const { organization } = await verifyOrgAuth(userId!, organizationId);

        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const session = await stripe.billingPortal.sessions.create({
            customer: organization.customerId,
            return_url: `${SITE_URL}/dashboard`
        });
        
        return jsonResponse(200, {
            url: session.url
        });
        
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to create billing portal session' 
            }
        });
    }
}
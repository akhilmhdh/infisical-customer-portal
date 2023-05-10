import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, SITE_URL, MONGO_MAIN_DB_URI, DB_MAIN } from '@/app/api/config';

export async function GET(request: NextRequest) {
    try {
        console.log('get payment methods');
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const { data } = await stripe.paymentMethods.list({
            customer: organization.customerId,
            type: 'card',
        });
          
        return jsonResponse(200, {
            paymentMethods: data
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization payment methods'
            }
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        
        console.log('create payment method');
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        await dbConnect(DB_MAIN);
        const { organization } = await verifyOrgAuth(userId!, organizationId);

        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const session = await stripe.checkout.sessions.create({
            customer: organization.customerId,
            mode: 'setup',
            payment_method_types: ['card'],
            success_url: `${SITE_URL}/dashboard`,
            cancel_url: `${SITE_URL}/dashboard`
        });
        
        return jsonResponse(200, {
            url: session.url
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to create payment method session'
            }
        });
    }
}
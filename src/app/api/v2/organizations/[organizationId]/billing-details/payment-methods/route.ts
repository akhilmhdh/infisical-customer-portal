import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, SITE_URL, DB_MAIN } from '@/app/api/config';

interface PaymentMethod {
    id: string;
    card: {
        brand: string;
        funding: string;
        exp_month: number;
        exp_year: number;
        last4: string;
    }
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

        const { data } = await stripe.paymentMethods.list({
            customer: organization.customerId,
            type: 'card',
        });
        
        const pmtMethods = data.map((datum) => {
            const pmtMethod = datum as PaymentMethod;
            return ({
                _id: pmtMethod.id,
                brand: pmtMethod.card.brand,
                funding: pmtMethod.card.funding,
                exp_month: pmtMethod.card.exp_month,
                exp_year: pmtMethod.card.exp_year,
                last4: pmtMethod.card.last4
            });
        });
          
        return jsonResponse(200, {
            pmtMethods
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
            success_url: `${SITE_URL}/organizations/${organizationId}/portal/cloud`,
            cancel_url: `${SITE_URL}/organizations/${organizationId}/portal/cloud`
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
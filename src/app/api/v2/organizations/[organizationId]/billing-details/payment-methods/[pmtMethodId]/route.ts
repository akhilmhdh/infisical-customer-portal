import { NextRequest } from "next/server";
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, DB_MAIN } from '@/app/api/config';

export async function DELETE(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        const _id = request.nextUrl.pathname.split('/')[7];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		}); 

        const detached = await stripe.paymentMethods.detach(
            _id
        );

        return jsonResponse(200, {
            _id: detached.id,
            detached: true
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to delete payment method'
            }
        });
    }
}
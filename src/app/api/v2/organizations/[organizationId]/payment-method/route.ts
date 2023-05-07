import { NextRequest } from "next/server";
import Stripe from 'stripe'; 
import { jsonResponse } from '@/utils';
import { STRIPE_SECRET_KEY } from '@/config';

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
    apiVersion: "2022-11-15"
  });

export async function GET(request: NextRequest) {
    
    console.log('Inside payment-method');
    // TODO: restrict only users who are admins of [organizationId] in this endpoint

    try {

        // const paymentMethods = await stripe.customers.listPaymentMethods(
        //     'insert here',
        //     {type: 'card'}
        //   );
        
        return jsonResponse(200, {
            message: 'xxx'
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization payment methods'
            }
        });
    }
}
import { NextRequest } from "next/server";
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, DB_MAIN } from '@/app/api/config';

interface Customer {
    id: string;
    email: string;
    name: string;
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
        
        const customer = (await stripe.customers.retrieve(
            organization.customerId
        )) as Customer;
            
        return jsonResponse(200, {
            name: customer.name,
            email: customer.email
        });
        
    } catch (err){
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization billing details'
            }
        });
    }
}

// TODO: patch to update
export async function PATCH(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});
        
        const {
            email,
            name
        } = await request.json();
        
        const customer = await stripe.customers.update(
            organization.customerId,
            { email, name }
        );
        
        return jsonResponse(200, {
            email,
            name
        });
    
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to update organization billing details'
            }
        });
    }
}

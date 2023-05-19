import { NextRequest } from "next/server";
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, DB_MAIN } from '@/app/api/config';

interface TaxID {
    id: string;
    country: string;
    type: string;
    value: string;
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

        const { data } = await stripe.customers.listTaxIds(
            organization.customerId
        );
            
        const taxIds = data.map((datum) => {
            const taxId = datum as TaxID;
        
            return ({
                _id: taxId.id,
                country: taxId.country,
                type: taxId.type,
                value: taxId.value
            });
        });
        
        return jsonResponse(200, {
            tax_ids: taxIds
        });
    } catch (err) {
        console.error(err);
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization tax ids'
            }
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		}); 
        
        const {
            type,
            value
        } = await request.json();

        const taxId = (await stripe.customers.createTaxId(
            organization.customerId,
            { type, value }
        )) as TaxID;
            
        return jsonResponse(200, {
            _id: taxId.id,
            country: taxId.country,
            type: taxId.type,
            value: taxId.value
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to add organization tax id'
            }
        });
    }
}
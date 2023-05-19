import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { STRIPE_SECRET_KEY, SITE_URL, DB_MAIN, productFeatureMap } from '@/app/api/config';

interface Product {
    default_price: string;
}

interface SubscriptionItem {
    id: string;
}

interface Subscription {
    id: string;
    plan: {
        id: string;
        product: string;
        amount: number;
        interval: 'month' | 'year';
        metadata: {
            hosting_type: 'hosted' | 'self-hosted';
        }
    },
    items: {
        data: SubscriptionItem[];
    },
    customer: string;
    quantity: number;
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        const _id = request.nextUrl.pathname.split('/')[7];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);
    
        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		}); 

        const product = (await stripe.products.retrieve(
            _id
        )) as Product;

        const { data } = await stripe.subscriptions.list({
			customer: organization.customerId
		});

        const cloudPlans = data
            .filter(
                (datum) => {
                    const subscription = datum as unknown as Subscription;
                    return (
                        subscription.plan.product in productFeatureMap || 
                        subscription.plan.metadata.hosting_type === 'hosted'
                    );
                }
            )
            .map((datum) => {
                const subscription = datum as unknown as Subscription;
                return subscription;
            });

        await stripe.subscriptions.update(cloudPlans[0].id, {
            items: [
                {
                    id: cloudPlans[0].items.data[0].id,
                    price: product.default_price,
                    quantity: 1
                },
            ],
        });

        return jsonResponse(200, {
            updated: true
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to delete payment method'
            }
        });
    }
}
import { NextRequest } from 'next/server';
import { jsonResponse } from '@/app/api/utils';
// import { getProductFeatureTable } from '@/app/api/config';

import Stripe from 'stripe';    
import {
    STRIPE_PRODUCT_STARTER,
    STRIPE_PRODUCT_TEAM,
    STRIPE_PRODUCT_TEAM_ANNUAL,
    STRIPE_PRODUCT_PRO,
    STRIPE_PRODUCT_PRO_ANNUAL,
    STRIPE_SECRET_KEY,
    productFeatureMap
} from '@/app/api/config';
// import { productFeatureMap } from './productFeatureMap';

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
});


export const getProductFeatureTable = async (billingCycle: 'monthly' | 'yearly') => {
    const isBillingCycleMonthly = billingCycle === 'monthly';
    
    const head = await Promise.all(
        [
            {
                name: 'Starter',
                productId: STRIPE_PRODUCT_STARTER,
                slug: 'starter',
                tier: 0
            },
            {
                name: 'Team',
                productId: isBillingCycleMonthly ? STRIPE_PRODUCT_TEAM : STRIPE_PRODUCT_TEAM_ANNUAL,
                slug: isBillingCycleMonthly ? 'team' : 'team-annual',
                tier: 1
            },
            {
                name: 'Professional',
                productId: isBillingCycleMonthly ? STRIPE_PRODUCT_PRO : STRIPE_PRODUCT_PRO_ANNUAL,
                slug: isBillingCycleMonthly ? 'pro' : 'pro-annual',
                tier: 2
            }
        ]
        .map(async ({ name, productId, slug, tier }) => {
            const product = await stripe.products.retrieve(
                productId
            );

            const price = await stripe.prices.retrieve(
                product.default_price as string
            ); 
            
            const priceDisplay = isBillingCycleMonthly 
                ? (price.unit_amount! / 100).toFixed(2)
                : (price.unit_amount! / 12 / 100).toFixed(2);

            return ({
                name,
                priceLine: `$${priceDisplay} / user / mo`,
                productId,
                slug,
                tier
            });
        })
    );

    head.push({
        name: 'Enterprise',
        priceLine: 'Custom',
        productId: '',
        slug: 'enterprise',
        tier: 3
    });

    const rows = [
        {
            name: 'Organization member limit',
            field: 'memberLimit'
        },
        {
            name: 'Project limit',
            field: 'projectLimit'
        },
        {
            name: 'Secret versioning',
            field: 'secretVersioning'
        },
        {
            name: 'Point in time recovery',
            field: 'pitRecovery'
        },
        {
            name: 'RBAC',
            field: 'rbac'
        },
        {
            name: 'Custom rate limits',
            field: 'customRateLimits'
        }, 
        {
            name: 'Custom alerts',
            field: 'customAlerts'
        }, 
        {
            name: 'Audit logs',
            field: 'auditLogs'
        }
    ]
    
    const mappedRows = rows.map(({ name, field }) => {
        return ({
            name,
            starter: productFeatureMap[STRIPE_PRODUCT_STARTER][field],
            team: productFeatureMap[isBillingCycleMonthly ? STRIPE_PRODUCT_TEAM : STRIPE_PRODUCT_TEAM_ANNUAL][field],
            pro: productFeatureMap[isBillingCycleMonthly ? STRIPE_PRODUCT_PRO : STRIPE_PRODUCT_PRO_ANNUAL][field],
            enterprise: productFeatureMap['enterprise'][field]
        });
    })

    return ({
        head,
        rows: mappedRows
    })
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const billingCycle = searchParams.get('billing-cycle');
        
        if (!billingCycle) return jsonResponse(500, { 
            error: { 
                message: 'Failed to get cloud plans due to missing billing-cycle query param' 
            } 
        });

        if (
            billingCycle !== 'monthly' && 
            billingCycle !== 'yearly'
        ) return jsonResponse(500, { 
            error: { 
                message: 'Failed to get cloud plans due to invalid billing-cycle query param' 
            } 
        }); 

        const { head, rows } = await getProductFeatureTable(billingCycle);

        return jsonResponse(200, {
            head,
            rows
        }); 
    } catch (err) {
        console.error('err: ', err);
        return jsonResponse(500, { error: { message: 'Failed to get monthly plans' } }); 
    }
}
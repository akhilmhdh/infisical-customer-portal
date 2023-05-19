import { Types } from 'mongoose';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import { 
    STRIPE_SECRET_KEY,
    SITE_URL,
    DB_MAIN,
    productFeatureMap
} from'@/app/api/config';
import {
    MembershipOrg,
    Workspace
} from '@/app/api/models';

export const getCurrentProductFeatureTable = async ({
    productId,
    organizationId
}: {
    productId: string;
    organizationId: string;
}) => {
    const head = [
        {
            name: 'Allowed'
        },
        {
            name: 'Used'
        }
    ];

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
    ];

    const mappedRows = await Promise.all(
        rows.map(async ({ name, field }) => {
            
            const allowed = productFeatureMap[productId][field];
            let used = '-';
            
            await dbConnect(DB_MAIN);
            if (field === 'memberLimit') {
                used = String(await MembershipOrg.countDocuments({
                    organization: new Types.ObjectId(organizationId)
                }));
            } 
            
            else if (field === 'projectLimit') {
                used = String(await Workspace.countDocuments({
                    organization: new Types.ObjectId(organizationId)
                }));
            }

            return ({
                name,
                allowed,
                used
            });
        })
    );

    return ({
        head,
        rows: mappedRows
    });
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
    customer: string;
    quantity: number;
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
                return subscription.plan.product;
            });

            const { head, rows } = await getCurrentProductFeatureTable({
                productId: cloudPlans[0],
                organizationId
            });
        
        return jsonResponse(
            200, 
            {
                currentPlan: productFeatureMap[cloudPlans[0]] || productFeatureMap['enterprise'],
                head,
                rows
            }
        );
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
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];

        await dbConnect(DB_MAIN);
        const { organization } = await verifyOrgAuth(userId!, organizationId);

        const stripe = new Stripe(STRIPE_SECRET_KEY!, {
			apiVersion: '2022-11-15'
		});

        const session = await stripe.billingPortal.sessions.create({
            customer: organization.customerId,
            return_url: `${SITE_URL}/organizations/${organizationId}/portal/cloud`
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
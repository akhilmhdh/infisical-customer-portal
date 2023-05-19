import { NextRequest } from 'next/server';
import { jsonResponse } from '@/app/api/utils';
import { getProductFeatureTable } from '@/app/api/config';

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
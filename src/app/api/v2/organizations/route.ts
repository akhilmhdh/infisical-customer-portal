import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {
    MembershipOrg,
    Organization
} from '../../db';
import { jsonResponse } from '@/utils';
import { OWNER } from '../../../../config';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        
        if (!userId) return jsonResponse(500, { error: { message: 'Authentication failed.' } });

        const organizationIds = await MembershipOrg.distinct('organization', {
            user: new Types.ObjectId(userId),
            role: OWNER
        });
        
        const organizations = await Organization.find({
            _id: {
                $in: organizationIds
            }
        });

        return jsonResponse(200, {
            organizations
        });
    } catch (err) {
        return jsonResponse(500, {
            message: 'Failed to get organizations'
        })
    }
}
import { Types } from 'mongoose';
import { NextRequest } from 'next/server';
import { dbConnect, jsonResponse } from '@/app/api/utils';
import {
    MembershipOrg,
    Organization
} from '@/app/api/models';
import { OWNER, DB_MAIN } from '@/app/api/config';

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        
        if (!userId) return jsonResponse(500, { error: { message: 'Authentication failed.' } });

        await dbConnect(DB_MAIN);

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
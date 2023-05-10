import { NextRequest } from 'next/server';
import { jsonResponse } from '@/app/api/utils';

// TODO
// note: license/:licenseId/features in the future 

export async function GET(request: NextRequest) {
    try {
        // TODO: query for licenses
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization licenses.'
            }
        });
    }
}


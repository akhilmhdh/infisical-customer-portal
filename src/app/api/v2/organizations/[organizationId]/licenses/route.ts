import { NextRequest } from 'next/server';
import { dbConnect, jsonResponse, decryptSymmetric } from '@/app/api/utils';
import { verifyOrgAuth } from '@/app/api/helpers';
import {
    DB_MAIN,
    ENCRYPTION_KEY
} from '@/app/api/config';
import {
    ILicense,
    License 
} from '@/app/api/models';

export async function GET(request: NextRequest) {
    try {
        await dbConnect(DB_MAIN);
        const userId = request.headers.get('userId');
        const organizationId = request.nextUrl.pathname.split('/')[4];
        
        const { organization } = await verifyOrgAuth(userId!, organizationId);

        let licenses = await License.find({
            customerId: organization.customerId
        });

        licenses = await Promise.all(
            licenses.map(async ({ 
                _id,
                encryptedLicenseKey, 
                iv, 
                subscriptionId,
                seats,
                isActivated,
                createdAt,
                updatedAt
            }: ILicense) => {
                const licenseKey = await decryptSymmetric(
                    encryptedLicenseKey, 
                    iv, 
                    ENCRYPTION_KEY
                );
                    
                return ({
                    _id,
                    subscriptionId,
                    seats,
                    isActivated,
                    createdAt,
                    updatedAt,
                    licenseKey
                });
            })
        );
        
        return jsonResponse(200, {
            licenses
        });
    } catch (err) {
        return jsonResponse(500, {
            error: {
                message: 'Failed to get organization licenses.'
            }
        });
    }
}


import { Types } from 'mongoose';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import {
    jsonResponse,
    verifyAuth
} from '@/utils'; 
import {
    MembershipOrg
} from './app/api/db';
import {
    OWNER
} from '@/config';

// TODO: add some error-handling here.
// TODO: modularize these smaller middleware.
// TODO: properly cover case of error-handling etc. when user's jwt has expired

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    
    const verifiedToken = await verifyAuth(request).catch((err) => {
        console.error(err.message)
    });

    // authen middleware
    if (!verifiedToken) {
        // if this an API request, respond with JSON
        
        if (request.nextUrl.pathname.startsWith('/api/')) {
            return jsonResponse(401, {
                error: {
                    message: 'Authentication required.'
                }
            });
        }

        // otherwise, redirect to the set token page
        else {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }
    
    // authorization middleware

    if (request.nextUrl.pathname.startsWith('/api/v2/organizations/')) {
        console.log('Accessing /organizations - should validate');
        // console.log('request.body: ', request.body);
        // console.log('request: ', request);
        const organizationId = request.nextUrl.pathname.split('/')[4];
    
        console.log('orgId: ', organizationId);
        console.log('find: ', {
            organization: new Types.ObjectId(organizationId),
            user: new Types.ObjectId(verifiedToken.userId),
            role: OWNER
        });
        
        const membershipOrg = await MembershipOrg.findOne({
            organization: new Types.ObjectId(organizationId),
            user: new Types.ObjectId(verifiedToken.userId),
            role: OWNER
        });
        
        // if (!membershipOrg) return jsonResponse(401, {
        //     error: {
        //         message: 'Unauthorized.'
        //     }
        // });
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userId', verifiedToken.userId);

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/v2/organizations/:path*'
};
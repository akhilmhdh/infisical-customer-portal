import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verifyAuth } from '@/app/api/helpers';
import {
    dbConnect,
    jsonResponse
} from '@/app/api/utils';
import { DB_MAIN } from '@/app/api/config';

export async function middleware(request: NextRequest) {
    await dbConnect(DB_MAIN);

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
    matcher: [
        '/dashboard/:path*', 
        '/api/v2/organizations/:path*'
    ]
};
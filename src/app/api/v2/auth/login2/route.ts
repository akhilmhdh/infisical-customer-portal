import { NextResponse } from 'next/server';
import jsrp from 'jsrp';
import { dbConnect } from '@/app/api/utils';
import {
    User,
    LoginSRPDetail
} from '@/app/api/models'; 
import { jsonResponse } from '@/app/api/utils';
import { setUserCookie } from '@/app/api/helpers';
import { DB_MAIN, MONGO_MAIN_DB_URI } from '@/app/api/config';

export async function POST(request: Request) {
    try {
        const {
            email,
            clientProof
        }: {
            email: string;
            clientProof: string;
        } = await request.json();

        await dbConnect(DB_MAIN);
    
        const user = await User.findOne({
          email
        }).select('+salt +verifier');
    
        if (!user) throw new Error('Failed to find user');
    
        const loginSRPDetail = await LoginSRPDetail.findOneAndDelete({ email: email })
    
        if (!loginSRPDetail) throw Error('Failed to find login SRP detail');
    
        interface Result {
            mfaEnabled: boolean;
            userId: string;
        }
        
        const result: Result = await new Promise(async (resolve, reject) => {
            const server = new jsrp.server();
            server.init(
            {
                salt: user.salt,
                verifier: user.verifier,
                b: loginSRPDetail.serverBInt
            },
            async () => {
                server.setClientPublicKey(loginSRPDetail.clientPublicKey);
        
                // compare server and client shared keys
                if (!server.checkClientProof(clientProof)) reject();
                
                if (user.isMfaEnabled) {
                    // TODO: handle MFA case
                }
                
                resolve({
                    mfaEnabled: false,
                    userId: user._id.toString()
                });
            });
        });
        
        return await setUserCookie(NextResponse.json(result), result.userId);
    } catch (err) {
        return jsonResponse(500, { error: { message: 'Authentication failed.' } });
    }
}
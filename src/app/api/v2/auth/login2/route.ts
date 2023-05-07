import { NextResponse } from 'next/server';
import jsrp from 'jsrp';
import {
    connectMongo,
    User,
    LoginSRPDetail
} from '../../../db';
import { jsonResponse, setUserCookie } from '@/utils';

export async function POST(request: Request) {
    try {
        const {
            email,
            clientProof
        }: {
            email: string;
            clientProof: string;
        } = await request.json();

        await connectMongo();
    
        const user = await User.findOne({
          email
        }).select('+salt +verifier +encryptionVersion +protectedKey +protectedKeyIV +protectedKeyTag +publicKey +encryptedPrivateKey +iv +tag');
    
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
                
                // note: don't need to send all the crypto stuff bc this is just
                // the license server
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
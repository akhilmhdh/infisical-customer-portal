import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
const jsrp = require('jsrp');
import * as bigintConversion from 'bigint-conversion'
import { dbConnect, jsonResponse } from '@/app/api/utils';
import {
  User,
  LoginSRPDetail
} from '@/app/api/models';
import { DB_MAIN } from '@/app/api/config';

export async function POST(request: Request) {
    try {
        await dbConnect(DB_MAIN);

        const { 
            email, 
            clientPublicKey 
        }: { 
            email: string, 
            clientPublicKey: string 
        } = await request.json();
      
          const user = await User.findOne({
            email
          }).select('+salt +verifier');
      
          if (!user) throw new Error('Failed to find user');
      
          const server = new jsrp.server();
          const result = await new Promise(async (resolve, reject) => {
            server.init(
              {
                salt: user.salt,
                verifier: user.verifier
              },
              async () => {
                try {
                  // generate server-side public key
                  const serverPublicKey = server.getPublicKey();
                  
                  await LoginSRPDetail.findOneAndReplace({ email: email }, {
                    email: email,
                    clientPublicKey: clientPublicKey,
                    serverBInt: bigintConversion.bigintToBuf(server.bInt),
                  }, { upsert: true, returnNewDocument: false });
                  
                  resolve({
                    serverPublicKey,
                    salt: user.salt
                  });
                } catch (err) {
                  reject(err);
                }
              }
            );
          })
          return jsonResponse(200, result);
    } catch (err) {
      console.error(err);
      return NextResponse.error();
    }
}
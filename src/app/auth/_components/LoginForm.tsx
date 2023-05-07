"use client"
import { useState } from 'react';
import jsrp from 'jsrp';
import { useRouter } from 'next/navigation';
import { 
    useForm, 
    SubmitHandler,
    Controller
} from 'react-hook-form';
import { Input } from '@/components';
import {
    setAuthToken,
    apiRequest
} from '../../../config';

import axios from 'axios';

type Inputs = {
    email: string;
    password: string;
}

export function LoginForm() {
    const router = useRouter();

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
        const client = new jsrp.client();
        client.init(
            {
                username: email,
                password
            },
            async () => {
                const clientPublicKey = client.getPublicKey();
                console.log('clientPublickey: ', clientPublicKey);

                const { data: { salt, serverPublicKey } } = await apiRequest.post('/api/v2/auth/login1', {
                    email,
                    clientPublicKey
                });
                
                console.log('A');
                client.setSalt(salt);
                console.log('B');
                client.setServerPublicKey(serverPublicKey);
                console.log('C');
                const clientProof = client.getProof(); // called M1
                
                console.log('clientProof: ', clientProof);

                const { 
                    data: {
                        mfaEnabled,
                        encryptionVersion,
                        token,
                        publicKey,
                        encryptedPrivateKey,
                        iv,
                        tag
                    }
                } = await apiRequest.post('/api/v2/auth/login2', {
                    email,
                    clientProof
                });
                
                setAuthToken(token);
                
                if (mfaEnabled) {
                    // TOOD: handle MFA case
                }
                
                // TODO: handle all the decryption stuff on the client side then
                // redirect to the dashboard
                // actually don't need to decrypt anything because we just need JWT here.

                router.push('/dashboard');
            }
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Input {...field} />}
            />
            {errors.email && <span>This field is required</span>}
            <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Input {...field} />}
            />
            {errors.password && <span>This field is required</span>}
            <input type="submit" />
        </form>
    );
}
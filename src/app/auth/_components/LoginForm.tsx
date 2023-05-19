"use client"
import { useState } from 'react';
import jsrp from 'jsrp';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
    setAuthToken,
    apiRequest
} from '../../config';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ClipLoader from "react-spinners/ClipLoader";

const schema = yup.object({
    email: yup.string().required('Email is required').email('Email is invalid'),
    password: yup.string().required()
  }).required();

export function LoginForm() {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { control, register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(schema)
    });

    const onSubmit = async ({ email, password }: { email: string, password: string }) => {
        if (email === '' || password === '') return;

        try {
            setIsSubmitting(true);
            const client = new jsrp.client();
            client.init(
                {
                    username: email,
                    password
                },
                async () => {
                    const clientPublicKey = client.getPublicKey();

                    const { data: { salt, serverPublicKey } } = await apiRequest.post('/api/v2/auth/login1', {
                        email,
                        clientPublicKey
                    });
                    
                    client.setSalt(salt);
                    client.setServerPublicKey(serverPublicKey);
                    const clientProof = client.getProof();

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

                    const { 
                        data: { organizations } 
                    } = await apiRequest.get('/api/v2/organizations');
                    
                    setIsSubmitting(false);
                    if (organizations.length > 0) {
                        router.push(`/organizations/${organizations[0]._id}/portal/cloud`);
                    } else {
                        // TODO
                    }
                }
            );
        } catch (err) {
            setIsSubmitting(false); 
        }
    }

    const submitButtonColor = (watch('email') !== '' && watch('password') !== '' ? 'bg-primary' : 'bg-slate-600');

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 w-96 max-w-full"
        >
            <h1 className="text-white text-center font-bold text-2xl mb-10">Infisical Customer Portal</h1>
            <input 
                {...register('email', { required: true })} 
                placeholder='Email'
                className="py-3 px-4 w-full rounded-md outline-none mb-6 border-1 border-slate-300 text-white focus:border-primary bg-midnight transition font-normal"
            />
            <input 
                {...register('password', { required: true })} 
                type="password"
                placeholder='Password'
                className="py-3 px-4 w-full rounded-md outline-none mb-6 border-1 border-slate-300 text-white focus:border-primary bg-midnight transition font-normal"
            />
            {isSubmitting ? (
                <div 
                    className={`bg-primary py-3 px-6 w-full rounded-md shadow-md cursor-pointer hover:bg-primary flex justify-center items-center`}
                >
                    <ClipLoader
                        color="#ffffff"
                        loading={true}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            ) : (
                <input 
                    type="submit" 
                    value="Log In"
                    className={`${submitButtonColor} transition py-3 px-6 w-full rounded-md shadow-md cursor-pointer hover:bg-primary`}
                />
            )}
        </form>
    );
}
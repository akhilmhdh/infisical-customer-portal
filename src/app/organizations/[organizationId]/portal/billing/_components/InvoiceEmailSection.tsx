"use client"
import { useEffect, useState } from 'react';
import {
    useGetBillingDetails,
    useUpdateBillingDetails
} from '@/hooks/api';
import { useForm } from 'react-hook-form'; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ClipLoader from "react-spinners/ClipLoader";

const schema = yup.object({
    email: yup.string().required('Email is required').email('Email is invalid')
}).required();

export function InvoiceEmailSection({
    organizationId
}: {
    organizationId: string;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, isLoading } = useGetBillingDetails(organizationId);
    const { reset, control, register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: ''
        },
        resolver: yupResolver(schema)
    });
    const updateBillingDetails = useUpdateBillingDetails();
    
    const onSubmit = async ({ email }: { email: string }) => {
        try {
            if (email === '') return;

            setIsSubmitting(true);
            await updateBillingDetails.mutateAsync({
                organizationId,
                email
            });
            setIsSubmitting(false);
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (data) {
            reset({
                email: data.email
            });
        }
    }, [data, reset]);

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 flex"
        >
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full shadow-md">
                <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-white">
                            Invoice Email Recipient
                        </h1>
                        {isSubmitting ? (
                            <ClipLoader
                                color="#ffffff"
                                loading={true}
                                size={25}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        ) : (
                            <button
                                className="rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white font-semibold"
                                disabled={isSubmitting}
                            >
                                Save
                            </button>
                        )}
                </div>
                {isLoading && (
                    <div className="flex justify-center items-center h-20">
                        <ClipLoader
                            color="#ffffff"
                            loading={true}
                            size={25}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )}
                {!isLoading && data && (
                    <input 
                        {...register('email', { required: true })} 
                        placeholder='johndoe@acme.com'
                        className="py-3 px-4 max-w-md w-full rounded-md outline-none mb-6 border-1 border-slate-300 text-white focus:border-primary bg-midnight transition font-normal"
                    />
                )}
            </div>
        </form>
    );
}
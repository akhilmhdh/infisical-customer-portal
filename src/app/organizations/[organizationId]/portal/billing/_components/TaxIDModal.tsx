"use client"
import { useState } from 'react';
import { Dialog } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form'; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAddTaxId } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";
import { taxIdTypeNameMap } from '@/app/config';

interface Props {
    organizationId: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const schema = yup.object({
    type: yup.string(),
    value: yup.string()
}).required();

export function TaxIDModal({
    organizationId,
    isOpen,
    setIsOpen
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { reset, control, register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            type: Object.keys(taxIdTypeNameMap)[0],
            value: ''
        },
        resolver: yupResolver(schema)
    });

    const addTaxId = useAddTaxId();

    const onSubmit = async ({
        type,
        value
    }: { 
        type: string;
        value: string;
    }) => {
        try {
            if (value === '') return;

            setIsSubmitting(true);
            
            await addTaxId.mutateAsync({
                organizationId,
                type,
                value
            });
            
            reset();
            setIsSubmitting(false);
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="fixed inset-0 flex items-center justify-center"
                >
                    <Dialog.Panel className="max-w-screen-sm w-full rounded-md bg-midnight-light shadow-md p-8">
                        <div className="flex justify-between items-center mb-8">
                            <Dialog.Title className="text-xl font-semibold text-white">
                                Add Tax ID
                            </Dialog.Title>
                            <button 
                                className="rounded-md inline-block py-3 px-4 text-white font-semibold"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon 
                                    icon={faXmark}
                                    size="lg"
                                />
                            </button>
                        </div>
                        <div className="flex mb-8">
                            <select 
                                {...register("type")} 
                                className="py-3 px-4 rounded-md outline-none border-1 border-slate-300 text-white focus:border-primary bg-midnight transition font-normal"
                            >
                                {Object.keys(taxIdTypeNameMap).map((key) => (
                                    <option 
                                        key={`tax-id-type-${key}`}
                                        value={key}
                                    >
                                        {taxIdTypeNameMap[key]}
                                    </option>
                                ))}
                            </select>

                            <input 
                                {...register('value', { required: true })} 
                                placeholder='DE000000000'
                                className="ml-4 py-3 px-4 max-w-md w-full rounded-md outline-none border-1 border-slate-300 text-white focus:border-primary bg-midnight transition font-normal"
                            />
                        </div>
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
                            >
                                Add
                            </button>
                        )}
                    </Dialog.Panel>
                </form>
            </Dialog>
    );
}
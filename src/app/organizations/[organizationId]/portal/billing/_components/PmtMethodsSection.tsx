"use client"
import { useState } from 'react';
import { PmtMethodTable } from './PmtMethodTable';
import { useAddPmtMethod } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

export function PmtMethodsSection({ organizationId }: { organizationId: string }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const addPmtMethod = useAddPmtMethod();

    const handleAddPmtMethodBtnClick = async () => {
        setIsProcessing(true);
        const url = await addPmtMethod.mutateAsync(organizationId);
        window.location.href = url;
        setIsProcessing(false);
    }

    return (
        <div className="p-8">
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full shadow-md">
                <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-white">Payment Methods</h1>
                        {isProcessing ? (
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
                                onClick={handleAddPmtMethodBtnClick}
                            >
                                Add Method
                            </button>
                        )}
                </div>
                <PmtMethodTable organizationId={organizationId} />
            </div>
        </div>
    );
}
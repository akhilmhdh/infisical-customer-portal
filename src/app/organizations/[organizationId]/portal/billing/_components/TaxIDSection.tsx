"use client"
import { useState } from 'react';
import { TaxIDModal } from './TaxIDModal';
import { TaxIDTable } from './TaxIDTable';

export function TaxIDSection({
    organizationId
}: {
    organizationId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-8 flex">
            <TaxIDModal 
                organizationId={organizationId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full shadow-md">
                <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-white">
                            Tax ID
                        </h1>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white font-semibold"
                        >
                            Add Tax ID
                        </button>
                </div>
                <TaxIDTable organizationId={organizationId} />
            </div>
        </div>
    );
}
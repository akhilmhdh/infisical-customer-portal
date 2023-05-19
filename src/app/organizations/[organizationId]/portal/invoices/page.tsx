"use client"
import {
    useGetInvoices
} from '@/hooks/api';

export default function InvoicesPage({
    params
}: {
    params: { [key: string]: string };
}) {
    const { data: invoices, isLoading: isInvoicesLoading } = useGetInvoices(params.organizationId ?? '');
    
    return (
        <div className="bg-midnight-dark w-full h-full pt-20">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-3xl font-semibold text-white mb-2">
                    Invoices
                </h1>
                <p className="text-slate-300">
                    Your invoices in one place
                </p>
            </div>
        </div>
    );
}
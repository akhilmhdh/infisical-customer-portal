"use client"
import {
    CompanyNameSection,
    PmtMethodsSection,
    InvoiceEmailSection,
    TaxIDSection
} from './_components';

export default function BillingPage({ 
    params 
}: {
    params: { [key: string]: string };
}) {
    return (
        <div className="bg-midnight-dark w-full h-full pt-20">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-3xl font-semibold text-white mb-2">
                    Billing
                </h1>
                <p className="text-slate-300">
                    Your billing information all in one place
                </p>
            </div>
            <CompanyNameSection organizationId={params.organizationId ?? ''} />
            <PmtMethodsSection organizationId={params.organizationId ?? ''} />
            <InvoiceEmailSection organizationId={params.organizationId ?? ''} />
            <TaxIDSection organizationId={params.organizationId ?? ''} />
        </div>
    );
}
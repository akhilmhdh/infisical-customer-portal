"use client"
import {
    LicensesSection
} from './_components';

export default function LicensesPage({ 
    params
}: {
    params: { [key: string]: string };
}) {

    return (
        <div className="bg-midnight-dark w-full h-full pt-20">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-3xl font-semibold text-white mb-2">
                    Infisical Self-hosted
                </h1>
                <p className="text-slate-300">Manage your self-hosted Infisical enterprise licenses</p>
            </div>
            <LicensesSection organizationId={params.organizationId ?? ''} />
        </div>
    );
}
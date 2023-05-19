"use client"
import { 
    CurrentPlanSection,
    PlansSection 
} from './_components';

export default function CloudPage({ 
    params 
}: {
    params: { [key: string]: string };
}) {
    return (
        <div className="bg-midnight-dark w-full h-full pt-20">
            <div className="px-8 pt-8 pb-4">
                <h1 className="text-3xl font-semibold text-white mb-2">
                    Infisical Cloud
                </h1>
                <p className="text-slate-300">Manage your Infisical Cloud plan</p>
            </div>
            <CurrentPlanSection 
                organizationId={params.organizationId ?? ''} 
            />
        </div>
    );
}
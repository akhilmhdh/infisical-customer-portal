import { useState } from 'react';
import Link from 'next/link';
import { useUpdateCloudPlan } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
    organizationId: string;
    productId: string;
    currentPlanSlug: string;
    currentPlanTier: number;
    planSlug: string;
    planTier: number;
}

export function UpgradeButton({
    organizationId,
    productId,
    currentPlanSlug,
    currentPlanTier,
    planSlug,
    planTier
}: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const updateCloudPlan = useUpdateCloudPlan();
    
    const handleUpdateCloudPlan = async () => {
        try {
            setIsProcessing(true);
            await updateCloudPlan.mutateAsync({
                organizationId,
                productId
            });

            setIsProcessing(false);
        } catch (err) {
            console.error(err);
            setIsProcessing(false);
        }
    }
    
    const renderBtn = () => {
        if (currentPlanSlug === planSlug) return (
            <button 
                className="rounded-md border-1 border-slate-300 w-full inline-block py-3 text-midnight font-semibold bg-slate-300"
                disabled={true}
            >
                Current
            </button> 
        );
            
        if (planSlug === 'enterprise') return (
            <Link 
                href="https://infisical.com/scheduledemo"
                className="rounded-md border-1 border-slate-300 inline-block w-full text-center py-3 px-4 text-white hover:bg-slate-300 hover:text-midnight transition font-semibold"
            >
                Contact sales
            </Link>
        );
            
        return isProcessing ? (
            <div className="rounded-md border-1 border-slate-300 w-full inline-block py-3 text-white font-semibold text-center">
                <ClipLoader
                    color="#ffffff"
                    loading={true}
                    size={25}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        ) : (
            <button 
                className="rounded-md border-1 border-slate-300 w-full inline-block py-3 text-white font-semibold hover:bg-slate-300 hover:text-midnight transition"
                onClick={handleUpdateCloudPlan}
            >
                {planTier < currentPlanTier ? 'Downgrade' : 'Upgrade'}
            </button> 
        );
    }

    return (
        <div 
            className="p-4 font-normal flex-grow w-full"
        >
            {renderBtn()}
        </div>
    );
}
import { useState } from 'react';
import { CurrentPlanTable } from './CurrentPlanTable';
import { ComparePlansModal } from './ComparePlansModal';
import { 
    useGetPmtMethods,
    useAddPmtMethod
} from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
    organizationId: string;
}

export function CurrentPlanSection({
    organizationId
}: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isOpen, setIsOpen] = useState(false)
    const { data } = useGetPmtMethods(organizationId);

    const addPmtMethod = useAddPmtMethod();
    
    const handleUpgradePlanBtnClick = async () => {
        try {
            if (!data) return;
            
            setIsProcessing(true);
            if (data.length === 0) {
                // customer has no existing payment methods on file
                // redirect to portal to add payment method

                const url = await addPmtMethod.mutateAsync(organizationId);
                window.location.href = url;
                setIsProcessing(false);
                return;
            }
        
            setIsOpen(true);
            setIsProcessing(false);
        } catch (err) {
            console.error(err);
            setIsProcessing(false);
        }
    }

    return (
        <div className="p-8 flex">
            <ComparePlansModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                organizationId={organizationId}
            />
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full shadow-md">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold text-white">Current Plan - Infisical Cloud Starter</h1>
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
                                onClick={handleUpgradePlanBtnClick}
                                className="rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white hover:bg-slate-300 hover:text-midnight transition font-semibold"
                            >
                                Upgrade plan
                            </button>
                        )}
                </div>
                <CurrentPlanTable organizationId={organizationId} />
            </div>
        </div>
    );
}
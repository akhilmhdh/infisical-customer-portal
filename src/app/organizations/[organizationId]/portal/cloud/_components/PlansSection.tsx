"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUserGroup, faPeopleGroup, faChevronCircleDown, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { 
    useManageCloudPlans,
    useGetCloudPlan
} from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";
import {
    ComparePlansModal
} from './ComparePlansModal';

export function PlansSection({
    organizationId
}: {
    organizationId: string;
}) {
    let [isOpen, setIsOpen] = useState(false)
    const manageCloudSubs = useManageCloudPlans();
    const { data: cloudPlan, isLoading: isCloudPlanLoading } = useGetCloudPlan(organizationId);
    
    const handleMngCloudSubscriptionBtnClick = async () => {
        const link = await manageCloudSubs.mutateAsync(organizationId); 
        window.location.href = link;
    }
    
    const currentPlanBorderStyle = (currentPlan: string, targetPlan: string) => {
        if (currentPlan === targetPlan) return "border-1 border-primary shadow-md";
        return "";
    }
    
    const currentPlanTextStyle = (currentPlan: string, targetPlan: string) => {
        if (currentPlan === targetPlan) return "text-primary";
        return "text-white";
    }

    return (
        <div className="p-8 flex">
            <ComparePlansModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full shadow-md">
            <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold text-white">Plans</h1>
                    <button 
                        className="rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white font-semibold"
                        onClick={() => setIsOpen(true)}
                    >
                        Compare plans
                    </button>
            </div>
            {isCloudPlanLoading && (
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
            {!isCloudPlanLoading && cloudPlan && (
                <>
                    <div className={`p-4 flex rounded-md items-start ${currentPlanBorderStyle(cloudPlan, 'starter')} cursor-pointer`}>
                        <div className='text-midnight bg-slate-300 rounded-md p-4'>
                            <FontAwesomeIcon 
                                icon={faSeedling} 
                                size="lg"
                            />
                        </div>
                        <div className="ml-4 w-full mr-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-slate-100">
                                    Starter (Current)
                                </p>
                                <p className="font-semibold text-slate-100">
                                    Free
                                </p>
                            </div>
                            <p className="font-semibold text-slate-100">Manage any projects up to 5 members for free.</p>
                        </div>
                    </div>
                    <div className={`p-4 flex rounded-md items-start ${currentPlanBorderStyle(cloudPlan, 'team')} cursor-pointer`}>
                        <div className='text-slate-800 rounded-md bg-slate-300 p-4'>
                            <FontAwesomeIcon 
                                icon={faUserGroup} 
                                size="lg"
                            />
                        </div>
                        <div className="ml-4 w-full mr-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-slate-100">Team</p>
                                <p className="font-semibold text-slate-100">$14/user/month</p>
                            </div>
                            <p className="font-normal text-slate-100">Improve security and efficiency.</p>
                        </div>
                    </div>
                    <div className={`p-4 flex rounded-md items-start ${currentPlanBorderStyle(cloudPlan, 'pro')} cursor-pointer`}>
                        <div className='text-slate-800 rounded-md bg-slate-300 p-4'>
                            <FontAwesomeIcon 
                                icon={faPeopleGroup} 
                                size="lg"
                            />
                        </div>
                        <div className="ml-4 w-full mr-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-slate-100">Professional</p>
                                <p className="font-semibold text-slate-100">$20/user/month</p>
                            </div>
                            <p className="font-normal text-slate-100">Keep up with key management as you grow.</p>
                        </div>
                    </div>
                    <div className={`p-4 flex rounded-md items-start ${currentPlanBorderStyle(cloudPlan, 'enterprise')} cursor-pointer mb-8`}>
                        <div className='text-slate-800 rounded-md bg-slate-300 p-4 w-16 h-16 text-center flex items-center justify-center'>
                            <FontAwesomeIcon 
                                icon={faBuilding} 
                                size="lg"
                            />
                        </div>
                        <div className="ml-4 w-full mr-4">
                            <div className="flex justify-between">
                                <p className="font-semibold text-slate-100">Professional</p>
                                <p className="font-semibold text-slate-100">Custom pricing</p>
                            </div>
                            <p className="font-normal text-slate-100">Boost the security and efficiency.</p>
                        </div>
                    </div>
                    {/* <Link 
                        href="https://infisical.com/pricing"
                        className="w-full text-center rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white hover:bg-slate-300 hover:text-midnight transition font-semibold"
                    >
                        Compare plans
                    </Link> */}
                </>
            )}
            </div>
        </div>

    );
}
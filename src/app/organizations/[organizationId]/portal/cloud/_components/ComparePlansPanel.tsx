import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react'
import {
    useGetCloudPlan,
    useGetCloudPlans
} from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";
import { UpgradeButton } from './UpgradeButton';

interface Props {
    billingCycle: 'monthly' | 'yearly';
    organizationId: string;
}

export function ComparePlansPanel({
    billingCycle,
    organizationId
}: Props) {
    const { data: currentPlanData } = useGetCloudPlan(organizationId);
    const { data, isLoading } = useGetCloudPlans(billingCycle);
    
    const displayCell = (value: null | number | string | boolean) => {
        if (value === null) return '-';
        
        if (typeof value === 'boolean') {
            if (value) return (
                <FontAwesomeIcon 
                    icon={faCircleCheck}
                    size="sm"
                    color='#2ecc71'
                />
            );

            return '';
        }
        
        return value;
    }
    
    return (
        <Tab.Panel>
            {!isLoading && data?.head && data?.rows ? (
                <div>
                    <div className="rounded-t-md border-1 border-slate-300 w-full flex bg-slate-300">
                        <div className="p-4 text-midnight font-semibold flex-grow w-full">
                            Feature
                        </div>
                        {data?.head?.length > 0 && data.head.map(({
                            name,
                            priceLine
                        }: {
                            name: string;
                            priceLine: string;
                        }) => {
                            return (
                                <div 
                                    key={`plans-table-head-${name}-${billingCycle}`}
                                    className="p-4 text-midnight font-semibold flex-grow w-full text-center"
                                >
                                    <p>{name}</p>
                                    <p>{priceLine}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        <table className="table-auto rounded-md border-1 border-slate-300 w-full overflow-hidden">
                            <tbody>
                                {data?.rows?.length > 0 && data.rows.map(({
                                    name, starter, team, pro, enterprise
                                }: {
                                    name: string;
                                    starter: null | number | string | boolean;
                                    team: null | number | string | boolean;
                                    pro: null | number | string | boolean;
                                    enterprise: null | number | string | boolean;
                                }) => {
                                    return (
                                        <tr 
                                            key={`plans-table-row-${name}`}
                                            className="text-white text-center"
                                        >
                                            <td className="p-4 font-normal text-left w-1/5">{displayCell(name)}</td>
                                            <td className="p-4 font-normal w-1/5">{displayCell(starter)}</td>
                                            <td className="p-4 font-normal w-1/5">{displayCell(team)}</td>
                                            <td className="p-4 font-normal w-1/5">{displayCell(pro)}</td>
                                            <td className="p-4 font-normal w-1/5">{displayCell(enterprise)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex rounded-md w-full">
                            <div className="p-4 font-normal flex-grow w-full">

                            </div>
                            {currentPlanData?.currentPlan && data?.head?.length > 0 && data.head.map(({
                                name,
                                priceLine,
                                slug,
                                tier,
                                productId
                            }: {
                                name: string;
                                priceLine: string;
                                slug: string;
                                tier: number;
                                productId: string;
                            }) => {
                                return (
                                    <UpgradeButton 
                                        organizationId={organizationId}
                                        productId={productId}
                                        currentPlanSlug={currentPlanData.currentPlan.slug}
                                        currentPlanTier={currentPlanData.currentPlan.tier}
                                        planSlug={slug}
                                        planTier={tier}
                                        key={`plans-table-btn-${slug}`}
                                    />
                                );
                            })}
                    </div>
                </div>
            ) : (
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
        </Tab.Panel>
    );
}
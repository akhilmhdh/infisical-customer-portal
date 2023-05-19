import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {
    useGetCloudPlan
} from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
    organizationId: string;
}

export function CurrentPlanTable({
    organizationId
}: Props) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data, isLoading } = useGetCloudPlan(organizationId);

    console.log('current cloud plan: ', data);
    
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
        <div>
            {!isLoading && data?.head && data?.rows ? (
                <>
                    <table className="table-auto text-left rounded-md border-1 border-slate-300 overflow-hidden w-full mb-8">
                        <thead>
                            <tr className="border-slate-300 bg-slate-300">
                                <th className="p-4 text-midnight font-semibold">Feature</th>
                                {data?.head.length > 0 && data.head.map(({
                                    name
                                }: {
                                    name: string;
                                }) => (
                                    <th 
                                        key={`current-plan-table-head-${name}`}
                                        className="p-4 text-midnight font-semibold"
                                    >
                                        <p>{name}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.rows.length > 0 && data.rows.slice(0, isExpanded ? data.rows.length : 4).map(({
                                name,
                                allowed,
                                used
                            }: {
                                name: string;
                                allowed: string;
                                used: string;
                            }) => (
                                <tr 
                                key={`current-plan-table-row-${name}`}
                                    className="text-white"
                                >
                                    <td className="p-4 font-normal">{name}</td>
                                    <td className="p-4 font-normal">{displayCell(allowed)}</td>
                                    <td className="p-4 font-normal">{used}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isExpanded && (
                        <button 
                            onClick={() => setIsExpanded(true)}
                            className="w-full text-center rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white hover:bg-slate-300 hover:text-midnight transition font-semibold"
                        >
                            View all features
                        </button>
                    )}
                </>
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
        </div>
    );
}
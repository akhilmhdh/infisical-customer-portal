import { Tab } from '@headlessui/react'
import { ComparePlansTab } from './ComparePlansTab';
import { ComparePlansPanel } from './ComparePlansPanel';

interface Props {
    organizationId: string;
}

export function ComparePlansTabGroup({
    organizationId
}: Props) {
    return (
        <Tab.Group>
            <Tab.List className="text-center mb-8">
                <ComparePlansTab name="Bill monthly" />
                <ComparePlansTab name="Bill yearly" />
            </Tab.List>
            <Tab.Panels>
                <ComparePlansPanel 
                    billingCycle="monthly" 
                    organizationId={organizationId}
                />
                <ComparePlansPanel 
                    billingCycle="yearly"
                    organizationId={organizationId}
                />
            </Tab.Panels>
        </Tab.Group>
    );
}
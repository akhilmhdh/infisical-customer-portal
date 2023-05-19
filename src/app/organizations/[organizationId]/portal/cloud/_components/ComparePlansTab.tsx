import { Fragment } from 'react';
import { Tab } from '@headlessui/react'

interface Props {
    name: string;
}

export function ComparePlansTab({
    name
}: Props) {
    return (
        <Tab as={Fragment}>
            {({ selected }) => (
                <button
                    className={
                        selected ? 'bg-slate-300 text-midnight py-3 px-4 rounded-md font-semibold' : 'text-slate-300 py-3 px-4 rounded-md font-semibold'
                    }
                >
                    {name}
                </button>
            )}
        </Tab>
    );
}
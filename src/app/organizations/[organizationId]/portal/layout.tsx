"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { faCloud, faServer, faChevronDown, faBuilding, faXmark, faCreditCard, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {
    useGetOrganizations,
    useGetCurrentUser,
    useLogoutUser
} from '@/hooks/api';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function Layout ({
    children,
    params
}: {
    children: React.ReactNode;
    params: { [key: string]: string };
}) {
    const router = useRouter();
    const segment = useSelectedLayoutSegment();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef(null);

    const { data: organizations, isLoading, isFetching, error } = useGetOrganizations();
    const { data: user, isLoading: userLoading } = useGetCurrentUser();

    const logoutUser = useLogoutUser();

    const [selectedOption, setSelectedOption] = useState<undefined | string>(undefined);
    
    useEffect(() => {
        if (!isLoading && organizations) {
            if (organizations.length === 0) {
                // user is not an owner in any organization
                // render some screen
                
                // TODO
            }
            
            // user is an owner in at least 1 organization
            setSelectedOption(organizations[0]._id);
            localStorage.setItem('organization_id', organizations[0]._id);
        }
        
    }, [isLoading, organizations]);
    
    const handleLogout = async () => {
        await logoutUser.mutateAsync();
        localStorage.removeItem('organization_id');
        router.push('/auth/login');
    }
    
    const handleChangeSelectedOrg = (organizationId: string) => {
        setSelectedOption(organizationId);
        setIsPopoverOpen(false);
        localStorage.setItem('organization_id', organizations[0]._id);
    }

    return (
        <section className="min-h-screen h-full bg-midnight">
            <div className="fixed flex justify-between items-center px-8 py-4 bg-gradient-to-r bg-midnight-light border-b-1 border-slate-400 w-full">
                <h1 className="text-xl font-semibold text-white mb-2">
                    Customer Portal
                </h1>
                {!userLoading && !isLoading && user && (
                    <>
                            <button 
                                onClick={() => setIsPopoverOpen(true)}
                                className="flex items-center cursor-pointer text-white font-normal"
                            >
                                <h1 className="mr-4 font-normal">{`${user.firstName} / ${organizations[0].name}`}</h1>
                                <FontAwesomeIcon 
                                    icon={faChevronDown}
                                    size="lg"
                                />
                            </button>
                            <button 
                                onClick={async () => await handleLogout()}
                                className="flex items-center cursor-pointer text-white font-normal"
                            >
                                <h1 className="mr-4 font-normal">Logout</h1>
                            </button>
                        {isPopoverOpen && (
                            <div className="absolute top-0 left-0 h-screen w-screen bg-midnight-dark opacity-100 items-center justify-center flex">
                                <div  className="bg-midnight-light rounded-md max-w-screen-sm w-full shadow-md p-8">
                                    <div ref={popoverRef} className="flex justify-between items-center mb-8">
                                        <h1 className="text-xl font-semibold text-white">Organizations</h1>
                                        <button 
                                            className="inline-block py-3 px-6 text-white font-semibold"
                                            onClick={() => setIsPopoverOpen(false)}
                                        >
                                        <FontAwesomeIcon 
                                            icon={faXmark} 
                                            size="lg"
                                        />
                                        </button>
                                    </div>
                                    {organizations && organizations.length > 0 && organizations.map(({ 
                                        _id, 
                                        name, 
                                        createdAt 
                                    }: {
                                        _id: string;
                                        name: string;
                                        createdAt: string;
                                    }) => {
                                        const formattedDate = new Date(createdAt).toISOString().split('T')[0];
                                        const isSelectedOrg = selectedOption === _id;
                                        return (
                                            <button 
                                                onClick={() => {
                                                    setIsPopoverOpen(false);
                                                    router.push(`/organizations/${_id}/portal/cloud`)
                                                }}
                                                className={`p-4 flex w-full rounded-md items-start cursor-pointer ${isSelectedOrg ? "border-1 border-primary" : ""}`}
                                            >
                                                <div className={`w-16 h-16 flex items-center justify-center text-midnight rounded-md p-4 ${isSelectedOrg ? "bg-primary" : "bg-slate-300"}`}>
                                                    <FontAwesomeIcon 
                                                        icon={faBuilding}
                                                        size="lg"
                                                    />
                                                </div>
                                                <div className="ml-4 text-left">
                                                    <p className={`font-semibold ${isSelectedOrg ? "text-primary" : "text-slate-300"}`}>{`${name} ${isSelectedOrg ? "(CURRENT)" : ""}`}</p>
                                                    <p className={`font-normal ${isSelectedOrg ? "text-primary" : "text-slate-300"}`}>{`Created on ${formattedDate}`}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div className="flex min-h-screen h-full">
                <div className="w-64 bg-midnight-light border-r-1 border-slate-400 pt-20">
                    <div className="px-4 mt-4">
                        <div className={`flex p-4 rounded-md ${segment === 'cloud' ? 'bg-midnight' : ''}`}>
                            <div className="text-slate-300 mr-4">
                                <FontAwesomeIcon 
                                    icon={faCloud} 
                                    size="lg"
                                />
                            </div>
                            <Link href={`/organizations/${params.organizationId ?? ''}/portal/cloud`} className="text-white">
                                Cloud
                            </Link>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className={`flex p-4 rounded-md ${segment === 'self-hosted' ? 'bg-midnight' : ''}`}>
                            <div className="text-slate-300 mr-4">
                                <FontAwesomeIcon 
                                    icon={faServer}
                                    size="lg"
                                />
                            </div>
                            <Link href={`/organizations/${params.organizationId ?? ''}/portal/self-hosted`} className="text-white">
                                Self-hosted
                            </Link>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className={`flex p-4 rounded-md ${segment === 'billing' ? 'bg-midnight' : ''}`}>
                            <div className="text-slate-300 mr-4">
                                <FontAwesomeIcon 
                                    icon={faCreditCard}
                                    size="lg"
                                />
                            </div>
                            <Link href={`/organizations/${params.organizationId ?? ''}/portal/billing`} className="text-white">
                                Billing
                            </Link>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className={`flex p-4 rounded-md ${segment === 'invoices' ? 'bg-midnight' : ''}`}>
                            <div className="text-slate-300 mr-4">
                                <FontAwesomeIcon 
                                    icon={faFileInvoiceDollar}
                                    size="lg"
                                />
                            </div>
                            <Link href={`/organizations/${params.organizationId ?? ''}/portal/invoices`} className="text-white">
                                    Invoices
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-red-400 h-full">
                    {children}
                </div>
            </div>
        </section>
    );
}
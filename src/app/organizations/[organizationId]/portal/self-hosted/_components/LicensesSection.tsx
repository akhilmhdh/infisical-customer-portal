"use client"
import { useGetLicenses } from '@/hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ClipLoader from "react-spinners/ClipLoader";

export function LicensesSection({
    organizationId
}: {
    organizationId: string;
}) {
    const { data: licenses, isLoading } = useGetLicenses(organizationId);
    return (
        <div className="p-8">
            <div className="bg-midnight-light inline-block p-8 rounded-md max-w-screen-lg w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold text-white">Enterprise Licenses</h1>
                        <Link 
                            href="https://infisical.com/scheduledemo"
                            className="rounded-md border-1 border-slate-300 inline-block py-3 px-4 text-white hover:bg-slate-300 hover:text-midnight transition font-semibold"
                        >
                            Contact sales
                        </Link>
                </div>
                {isLoading && (
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
                {!isLoading && licenses.length > 0 && (
                    <table className="table-auto text-left rounded-md border-1 border-slate-300 overflow-hidden w-full">
                        <thead>
                            <tr className="border-slate-300 bg-slate-300">
                                <th className="p-4 text-midnight font-semibold">License Key</th>
                                <th className="p-4 text-midnight font-semibold">Status</th>
                                <th className="p-4 text-midnight font-semibold">Capacity</th>
                                <th className="p-4 text-midnight font-semibold">Issued Date</th>
                                <th className="p-4 text-midnight font-semibold">Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.map(({
                                _id,
                                licenseKey,
                                isActivated,
                                seats,
                                createdAt
                            }: {
                                _id: string;
                                licenseKey: string;
                                isActivated: boolean;
                                seats: number;
                                createdAt: string;
                            }, index: number) => {
                                const formattedDate = new Date(createdAt).toISOString().split('T')[0];
                                const isLastItem = index === licenses.length - 1;
                                return (
                                    <tr 
                                        className="text-white"
                                        key={`license-${_id}`}
                                    >
                                        <td className={`p-4 font-normal ${isLastItem ? 'rounded-bl-md' : ''}`}>{licenseKey}</td>
                                        <td className="p-4 font-normal">{isActivated ? 'Active' : 'Inactive'}</td>
                                        <td className="p-4 font-normal">{seats}</td>
                                        <td className="p-4 font-normal">{formattedDate}</td>
                                        <td className={`p-4 font-normal`}>{formattedDate}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                {!isLoading && licenses.length === 0 && (
                    <div className="p-4 flex rounded-md items-center">
                            <div className='text-slate-800 rounded-md bg-slate-300 p-4 w-16 h-16 text-center flex items-center justify-center'>
                            <FontAwesomeIcon 
                                icon={faBuilding} 
                                size="lg"
                            />
                            </div>
                        <div className="ml-4">
                            <p className="font-semibold text-slate-100">No licenses to show</p>
                            <p className="font-normal text-slate-100">Get in touch with our enteprise sales team to purchase a license</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}
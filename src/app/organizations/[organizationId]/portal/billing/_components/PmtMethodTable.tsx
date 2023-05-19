import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useGetPmtMethods } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";
import { PmtMethodRow } from './PmtMethodRow';

interface Props {
    organizationId: string;
}

export function PmtMethodTable({
    organizationId
}: Props) {
    const { data, isLoading } = useGetPmtMethods(organizationId);

    return isLoading ? (
        <div className="flex justify-center items-center h-20">
            <ClipLoader
                color="#ffffff"
                loading={true}
                size={25}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div> 
    ) : (
        <div>
            {data && data.length > 0 && (
                <table className="table-auto text-left rounded-md border-1 border-slate-300 overflow-hidden w-full">
                    <thead>
                        <tr className="border-slate-300 bg-slate-300">
                            <th className="p-4 text-midnight font-semibold">Brand</th>
                            <th className="p-4 text-midnight font-semibold">Type</th>
                            <th className="p-4 text-midnight font-semibold">Last 4 Digits</th>
                            <th className="p-4 text-midnight font-semibold">Expiry Date</th>
                            <th className="p-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({
                            _id,
                            brand,
                            exp_month,
                            exp_year,
                            funding,
                            last4
                        }: {
                            _id: string;
                            brand: string;
                            exp_month: number;
                            exp_year: number;
                            funding: string;
                            last4: string;
                        }) => (
                            <PmtMethodRow 
                                organizationId={organizationId}
                                _id={_id}
                                brand={brand}
                                funding={funding}
                                last4={last4}
                                exp_month={exp_month}
                                exp_year={exp_year}
                                key={`pmt-method-${_id}`}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {data && data.length === 0 && (
                <div className="p-4 flex rounded-md items-center">
                    <div className='text-slate-800 rounded-md bg-slate-300 p-4 w-16 h-16 text-center flex items-center justify-center'>
                        <FontAwesomeIcon 
                            icon={faCreditCard} 
                            size="lg"
                        />
                    </div>
                    <div className="ml-4">
                        <p className="font-semibold text-slate-100">No payment methods to show</p>
                        <p className="font-normal text-slate-100">Add a payment method to upgrade your Infisical Cloud plan.</p>
                    </div>
                </div>
            )}
        </div>
    );
}


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { useGetTaxIds } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";
import {
    TaxIDRow
} from './TaxIDRow';

interface Props {
    organizationId: string;
}

export function TaxIDTable({
    organizationId
}: Props) {
    const { data, isLoading } = useGetTaxIds(organizationId);
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
                <table className="mt-4 table-auto text-left rounded-md border-1 border-slate-300 overflow-hidden w-full">
                    <thead>
                        <tr className="border-slate-300 bg-slate-300">
                            <th className="p-4 text-midnight font-semibold">Type</th>
                            <th className="p-4 text-midnight font-semibold">Value</th>
                            <th className="p-4 text-midnight font-semibold w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(({
                            _id,
                            type,
                            value
                        }: {
                            _id: string;
                            type: string;
                            value: string;
                        }) => {
                            return (
                                <TaxIDRow 
                                    organizationId={organizationId}
                                    _id={_id}
                                    type={type}
                                    value={value}
                                    key={`tax-id-${_id}`}
                                />
                            );
                        })}
                    </tbody>
                </table>
            )}
            {data && data.length === 0 && (
                <div className="p-4 flex rounded-md items-center">
                    <div className='text-slate-800 rounded-md bg-slate-300 p-4 w-16 h-16 text-center flex items-center justify-center'>
                        <FontAwesomeIcon 
                            icon={faFileInvoice} 
                            size="lg"
                        />
                    </div>
                    <div className="ml-4">
                        <p className="font-semibold text-slate-100">No tax IDs to show</p>
                        <p className="font-normal text-slate-100">If you would like your invoice to render a specific tax ID, add one here.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
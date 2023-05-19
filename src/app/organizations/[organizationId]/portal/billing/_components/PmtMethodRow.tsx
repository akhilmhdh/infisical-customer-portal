import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDeletePmtMethod } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
    organizationId: string;
    _id: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    last4: string;
}

export function PmtMethodRow({
    organizationId,
    _id,
    brand,
    funding,
    last4,
    exp_month,
    exp_year
}: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deletePmtMethod = useDeletePmtMethod();

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleDeletePmtMethod = async (_id: string) => {
        try {
            setIsDeleting(true);
            await deletePmtMethod.mutateAsync({
                organizationId,
                _id
            });
            setIsDeleting(false);
        } catch (err) {
            console.error(err);
            setIsDeleting(false);
        }
    }

    return (
        <tr className="text-white">
            <td className="p-4 font-normal">{capitalizeFirstLetter(brand)}</td>
            <td className="p-4 font-normal">{capitalizeFirstLetter(funding)}</td>
            <td className="p-4 font-normal">{last4}</td>
            <td className={`p-4 font-normal`}>{`${exp_month}/${exp_year}`}</td>
            <td className="p-4">
                {isDeleting ? (
                    <ClipLoader
                        color="#ffffff"
                        loading={true}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                ) : (
                    <button onClick={() => handleDeletePmtMethod(_id)}>
                        <FontAwesomeIcon 
                            icon={faTrash} 
                            size="lg"
                        /> 
                    </button>
                )}
            </td>
        </tr>
    );
}
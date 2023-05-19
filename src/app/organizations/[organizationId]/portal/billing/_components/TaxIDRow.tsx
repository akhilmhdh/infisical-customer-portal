"use client"
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { taxIdTypeNameMap } from '@/app/config';
import { useDeleteTaxId } from '@/hooks/api';
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
    organizationId: string;
    _id: string;
    type: string;
    value: string;
}

export function TaxIDRow({
    organizationId,
    _id,
    type,
    value
}: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteTaxId = useDeleteTaxId();

    const handleDeleteTaxId = async (_id: string) => {
        try {
            setIsDeleting(true);
            await deleteTaxId.mutateAsync({
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
            <td className="p-4 font-normal">{taxIdTypeNameMap[type]}</td>
            <td className="p-4 font-normal">{value}</td>
            <td className="p-4 font-normal">
                {isDeleting ? (
                    <ClipLoader
                        color="#ffffff"
                        loading={true}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                ) : (
                    <button onClick={() => handleDeleteTaxId(_id)}>
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
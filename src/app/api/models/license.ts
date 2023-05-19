import { Schema, Types, Document } from 'mongoose';
import { licenseDBConnection } from '@/app/api/utils';

export interface ILicense extends Document {
    _id: Types.ObjectId;
    customerId: string;
    price: string;
    product: string;
    seats: number;
    prefix: string;
    encryptedLicenseKey: string;
    iv: string;
    isActivated: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const licenseSchema = new Schema<ILicense>(
    {
        customerId: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        product: {
            type: String,
            required: true
        },
        seats: {
            type: Number,
            required: true
        },
        prefix: {
            type: String,
            required: true
        },
        encryptedLicenseKey: {
            type: String,
            required: true
        },
        iv: {
            type: String,
            required: true
        },
        isActivated: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const License = licenseDBConnection?.models?.License || licenseDBConnection?.model<ILicense>('License', licenseSchema);
import { Schema, Types, Document } from 'mongoose';
import { licenseDBConnection } from '@/app/api/utils';

export interface ILicenseFeatureSet extends Document {
    _id: Types.ObjectId;
    license: Types.ObjectId;
    projectLimit: number;
    memberLimit: number;
    secretVersioning: boolean;
    pitRecovery: boolean;
    rbac: boolean;
    customRateLimits: boolean;
    customAlerts: boolean;
    auditLogs: boolean;
}

const licenseFeatureSetSchema = new Schema<ILicenseFeatureSet>(
    {
        license: {
            type: Schema.Types.ObjectId,
            ref: 'License',
            required: true
        },
        projectLimit: {
            type: Number
        },
        memberLimit: {
            type: Number
        },
        secretVersioning: {
            type: Boolean
        },
        pitRecovery: {
            type: Boolean
        },
        rbac: {
            type: Boolean
        },
        customRateLimits: {
            type: Boolean
        },
        customAlerts: {
            type: Boolean
        },
        auditLogs: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

export const LicenseFeatureSet = licenseDBConnection?.models?.LicenseFeatureSet || licenseDBConnection?.model<ILicenseFeatureSet>('LicenseFeatureSet', licenseFeatureSetSchema);
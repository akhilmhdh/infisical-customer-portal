import { Schema, Types } from 'mongoose';
import { mainDBConnection } from '@/app/api/utils';

export interface IOrganization {
	_id: Types.ObjectId;
	name: string;
	customerId?: string;
}

const organizationSchema = new Schema<IOrganization>(
	{
		name: {
			type: String,
			required: true
		},
		customerId: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

export const Organization = mainDBConnection?.models?.Organization || mainDBConnection?.model<IOrganization>('Organization', organizationSchema);
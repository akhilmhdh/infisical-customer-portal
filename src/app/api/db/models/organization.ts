import { Schema, model, models, Types } from 'mongoose';

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

export const Organization = models.Organization || model<IOrganization>('Organization', organizationSchema);
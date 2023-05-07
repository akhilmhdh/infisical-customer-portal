import { Schema, model, models, Types, Document } from 'mongoose';
import { OWNER, ADMIN, MEMBER, INVITED, ACCEPTED } from '../../../../config';

export interface IMembershipOrg extends Document {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	inviteEmail: string;
	organization: Types.ObjectId;
	role: 'owner' | 'admin' | 'member';
	status: 'invited' | 'accepted';
}

const membershipOrgSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		inviteEmail: {
			type: String
		},
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization'
		},
		role: {
			type: String,
			enum: [OWNER, ADMIN, MEMBER],
			required: true
		},
		status: {
			type: String,
			enum: [INVITED, ACCEPTED],
			required: true
		}
	},
	{
		timestamps: true
	}
);

export const MembershipOrg = models.MembershipOrg || model<IMembershipOrg>(
	'MembershipOrg',
	membershipOrgSchema
);
import { Schema, Types } from 'mongoose';
import { mainDBConnection } from '@/app/api/utils';

export interface ILoginSRPDetail {
	_id: Types.ObjectId;
	clientPublicKey: string;
	email: string;
	serverBInt: Schema.Types.Buffer;
	expireAt: Date;
}

const loginSRPDetailSchema = new Schema<ILoginSRPDetail>(
	{
		clientPublicKey: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		serverBInt: { type: Schema.Types.Buffer },
		expireAt: { type: Date }
	}
);

export const LoginSRPDetail = mainDBConnection?.models?.LoginSRPDetail || mainDBConnection?.model<ILoginSRPDetail>('LoginSRPDetail', loginSRPDetailSchema);
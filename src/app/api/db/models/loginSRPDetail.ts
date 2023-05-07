import { Schema, model, models, Types } from 'mongoose';

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

export const LoginSRPDetail = models.LoginSRPDetail || model<ILoginSRPDetail>('LoginSRPDetail', loginSRPDetailSchema);

export default LoginSRPDetail;

import { Schema, Types, Document } from 'mongoose';
import { mainDBConnection } from '@/app/api/utils';

export interface IWorkspace extends Document {
	_id: Types.ObjectId;
	name: string;
	organization: Types.ObjectId;
	environments: Array<{
		name: string;
		slug: string;
	}>;
	autoCapitalization: boolean;
}

const workspaceSchema = new Schema<IWorkspace>({
	name: {
		type: String,
		required: true
	},
	autoCapitalization: {
		type: Boolean,
		default: true,
	},
	organization: {
		type: Schema.Types.ObjectId,
		ref: 'Organization',
		required: true
	},
	environments: {
		type: [
			{
				name: String,
				slug: String,
			},
		],
		default: [
			{
				name: "Development",
				slug: "dev"
			},
			{
				name: "Test",
				slug: "test"
			},
			{
				name: "Staging",
				slug: "staging"
			},
			{
				name: "Production",
				slug: "prod"
			}
		],
	},
});

export const Workspace = mainDBConnection?.models?.Workspace || mainDBConnection?.model<IWorkspace>('Workspace', workspaceSchema);
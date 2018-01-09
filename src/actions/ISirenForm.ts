import { EHttpVerb } from '../siren-spec/EHttpVerb';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

export interface ISirenForm<T extends ISirenFormFieldSet = {}> {
	readonly action: Siren.IAction;
	readonly id: string;
	readonly method: EHttpVerb;
	readonly type: string;
	readonly values: T;
	response: Response;
	serialize(): object;
	updateFields(update: Partial<T>): T;
}

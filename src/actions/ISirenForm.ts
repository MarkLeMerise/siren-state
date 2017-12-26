import { EHttpVerb } from '../siren-spec/EHttpVerb';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

export interface ISirenForm<T extends ISirenFormFieldSet = {}> {
	readonly action: Siren.IAction;
	readonly fields: T;
	readonly href: string;
	readonly id: string;
	readonly method: EHttpVerb;
	readonly name: string;
	response: Response;
	readonly type: string;
	serialize(): object;
	updateFields(update: Partial<T>): T;
}

import { isNil } from 'lodash';
import { v4 } from 'uuid';
import verifyAction from '../../siren-verify/verifyAction';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

/**
 * `SirenForm` provides an action "template" for mutating state.
 * Also verifies the necessary components of a Siren action to ensure the form can properly be used with a Siren-compliant API.
 *
 * Subclasses SHOULD provide methods for property mutation if the values are mutable.
 *
 * @template TValues The fields of the form as defined by the action
 * @template TMethods The allowed methods of the protocol
 */
export default class SirenForm<TValues extends ISirenFormFieldSet = {}, TMethods = {}> {
	public readonly action: Siren.IAction<TMethods>;
	public readonly id = v4();
	public values: TValues;

	constructor(action: Siren.IAction<TMethods>) {
		if (!verifyAction(action)) {
			throw new Error('Siren actions require a "name" and "href" field.');
		}

		this.action = action;
		this.values = (action.fields || []).reduce((fields, f) => {
			fields[f.name] = isNil(f.value) ? null : f.value;
			return fields;
		}, {} as any);
	}
}

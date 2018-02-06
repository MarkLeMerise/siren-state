import { isEmpty, isNil } from 'lodash';
import { v4 } from 'uuid';
import verifyAction from '../../siren-verify/verifyAction';
import { ISirenForm } from './ISirenForm';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

/**
 * `SirenForm` provides a more convenient abstraction for mutating state than plain Siren objects.
 * Also verifies the necessary components of a Siren action to ensure the form can properly be sent to the server.
 */
export default class SirenForm<V = {}, S extends ISirenFormFieldSet = {}, C = S> implements ISirenForm<V, S, C> {
	public action: Siren.IAction<V>;
	public id = v4();
	public values: C;

	constructor(action: Siren.IAction<V>) {
		if (!verifyAction(action)) {
			throw new Error('Siren actions require a "name" and "href" field.');
		}

		this.action = action;
		this.values = (action.fields || []).reduce((fields, f) => {
			fields[f.name] = isNil(f.value) ? null : f.value;
			return fields;
		}, {} as any);
	}

	/**
	 * Merge the `incoming` values into the existing values
	 *
	 * @param incoming The record to merge
	 * @return An updated `SirenForm` object
	 */
	public update(incoming: Partial<C>) {
		if (!isEmpty(incoming)) {
			this.values = Object.assign({}, this.values, incoming);
		}

		return this;
	}

	/**
	 * Serializes the field values into the shape defined by the Siren action
	 */
	public serialize(): S {
		return this.values as any;
	}
}

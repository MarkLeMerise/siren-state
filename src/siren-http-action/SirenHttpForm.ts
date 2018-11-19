import { isEmpty } from 'lodash';
import { ISirenFormFieldSet } from '../siren-state-core/actions/ISirenFormFieldSet';
import SirenForm from '../siren-state-core/actions/SirenForm';
import { EHttpMethod, isHttpMethod } from './EHttpMethod';

export default class SirenHttpForm<TValues extends ISirenFormFieldSet = {}> extends SirenForm<TValues, EHttpMethod> {
	constructor(action: Siren.IAction<EHttpMethod>) {
		if (!isHttpMethod(action.method)) {
			throw new Error('The "method" of an action must be a valid HTTP verb.');
		}

		super(action);
	}

	/**
	 * Returns the form values
	 *
	 * Subclasses may override this method to provide additional transformation on the values before they are serialized by a transport layer.
	 */
	public serialize() {
		return this.values;
	}

	/**
	 * Merge the `incoming` values into the existing values
	 *
	 * @param incoming The record to merge
	 * @return An updated `SirenForm` object
	 */
	public update(incoming: Partial<TValues>) {
		if (!isEmpty(incoming)) {
			this.values = Object.assign({}, this.values, incoming);
		}

		return this;
	}
}

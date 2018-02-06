import { ISirenFormFieldSet } from '../siren-state-core/actions/ISirenFormFieldSet';
import SirenForm from '../siren-state-core/actions/SirenForm';
import { EHttpVerb, isHttpMethod } from './EHttpVerb';

export default class SirenHttpForm<V extends EHttpVerb = EHttpVerb, S extends ISirenFormFieldSet = {}, C = S> extends SirenForm<V, S, C> {
	constructor(action: Siren.IAction<V>) {
		if (!isHttpMethod(action.method)) {
			throw new Error('The "method" of an action must be a valid HTTP verb.');
		}

		super(action);
	}
}

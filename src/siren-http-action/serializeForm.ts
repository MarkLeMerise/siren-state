import { isNil, isPlainObject, toString } from 'lodash';
import { ISirenFormFieldSet } from '../siren-state-core/actions/ISirenFormFieldSet';
import { EHttpVerb } from './EHttpVerb';
import SirenHttpForm from './SirenHttpForm';

const hasFileField = (fields: object) => Object.values(fields).some(f => f instanceof File);

export default function serializeForm<S extends ISirenFormFieldSet = {}>(form: SirenHttpForm<EHttpVerb, S>) {
	const serializedFields: S = form.serialize();

	if (!hasFileField(serializedFields)) {
		return serializedFields;
	}

	return Object.keys(serializedFields).reduce((data, key) => {
		let value: any = serializedFields[key];

		// After this block, `value` with either be File | string
		if (isNil(serializedFields[key])) {
			value = '';
		} else if (isPlainObject(value)) {
			value = JSON.stringify(value);
		} else if (!(serializedFields[key] instanceof File)) {
			// Even though FormData stringifies everything else anyways
			// We must stringify to pass type constraints
			value = toString(serializedFields[key]);
		}

		data.append(key, value);
		return data;
	}, new FormData());
}

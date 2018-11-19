import { isNil, isPlainObject } from 'lodash';

/**
 * Transforms a generic `formValues` object into a `FormData` object
 *
 * @param formValues The values of the form fields
 */
export default function createFormDataObject(formValues: Record<string, any>) {
	return Object.keys(formValues).reduce((data, key) => {
		let value = formValues[key];

		if (isNil(formValues[key])) {
			value = '';
		} else if (isPlainObject(value)) {
			value = JSON.stringify(value);
		} else if (!(formValues[key] instanceof File)) {
			value = formValues[key];
		}

		data.append(key, value);

		return data;
	}, new FormData());
}

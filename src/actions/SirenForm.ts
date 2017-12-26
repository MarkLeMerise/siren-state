import { isEmpty, isPlainObject, toString } from 'lodash';
import { v4 } from 'uuid';
import { EHttpVerb, isMethodInProtocol } from '../siren-spec/EHttpVerb';
import verifyAction from '../siren-verify/verifyAction';
import { ISirenForm } from './ISirenForm';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

export const URL_FORM_ENCODED_TYPE = 'application/x-www-form-urlencoded';

function isNullOrUndefined(obj: any): obj is null | undefined {
	return obj === null || obj === undefined;
}

function hasFileField(fields: object) {
	return Object.values(fields).some((f) => f instanceof File);
}

/**
 * Provides a more convenient abstraction for mutating state than plain Siren objects.
 * Also verifies the necessary components of a Siren action to ensure the form can properly be sent to the server.
 */
export default class SirenForm<T extends ISirenFormFieldSet = {}> implements ISirenForm<T> {
	public action: Siren.IAction;
	public fields: T;
	public href: string;
	public id = v4();
	public method: EHttpVerb;
	public name: string;
	public response: Response;
	public type: string;

	constructor(action: Siren.IAction) {
		if (!verifyAction(action)) {
			throw new Error('Siren actions require a "name" and "href" field.');
		}

		this.action = action;
		this.method = isMethodInProtocol(action.method) ? action.method : EHttpVerb.GET;
		this.name = action.name;
		this.href = action.href;
		this.type = action.type || URL_FORM_ENCODED_TYPE;
		this.fields = (action.fields || []).reduce((fields, f) => {
			fields[f.name] = isNullOrUndefined(f.value) ? null : f.value;
			return fields;
		}, {} as any);
	}

	/**
	 * Mutate the fields of this form, merging the `update` record into the existing fields
	 * @param update The record to merge
	 */
	public updateFields(update: Partial<T>) {
		if (!isEmpty(update)) {
			this.fields = Object.assign({}, this.fields, update);
		}

		return this.fields;
	}

	/**
	 * Serializes the field values using either FormData for File objects, or a POJO otherwise
	 */
	public serialize() {
		let serializedFields = this.onSerialize(this.fields);

		if (hasFileField(serializedFields)) {
			return Object.keys(serializedFields).reduce((form, key) => {
				let value: any = serializedFields[key];

				// After this block, `value` with either be File | string
				if (isNullOrUndefined(serializedFields[key])) {
					value = '';
				} else if (isPlainObject(value)) {
					value = JSON.stringify(value);
				} else if (!(serializedFields[key] instanceof File)) {
					// Even though FormData stringifies everything else anyways
					// We must stringify to pass type constraints
					value = toString(serializedFields[key]);
				}

				form.append(key, value);
				return form;
			}, new FormData());
		} else {
			return serializedFields;
		}
	}

	/**
	 * Hook for any custom field transformation for proper serialization
	 * For example, this function could properly format a JavaScript Date string for the server.
	 * MAY be overridden by an extending class
	 *
	 * @param fields The fields of the form
	 * @returns The tranformed fields
	 */
	protected onSerialize(fields: T): T {
		return fields;
	}
}

import { isEmpty, isPlainObject, toString } from 'lodash';
import { v4 } from 'uuid';
import { EHttpVerb, isMethodInProtocol } from '../siren-spec/EHttpVerb';
import verifyAction from '../siren-verify/verifyAction';
import { ISirenForm } from './ISirenForm';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

const hasFileField = (fields: object) => Object.values(fields).some(f => f instanceof File);
const isNullOrUndefined = (obj: any): obj is null | undefined => obj === null || obj === undefined;

export const URL_FORM_ENCODED_TYPE = 'application/x-www-form-urlencoded';

/**
 * Provides a more convenient abstraction for mutating state than plain Siren objects.
 * Also verifies the necessary components of a Siren action to ensure the form can properly be sent to the server.
 */
export default class SirenForm<T extends ISirenFormFieldSet = {}> implements ISirenForm<T> {
	public action: Siren.IAction;
	public values: T;
	public href: string;
	public id = v4();
	public response: Response;

	constructor(action: Siren.IAction) {
		if (!verifyAction(action)) {
			throw new Error('Siren actions require a "name" and "href" field.');
		}

		this.action = action;
		this.values = (action.fields || []).reduce((fields, f) => {
			fields[f.name] = isNullOrUndefined(f.value) ? null : f.value;
			return fields;
		}, {} as any);
	}

	public get method() {
		const { action } = this;
		return isMethodInProtocol(action.method) ? action.method : EHttpVerb.GET;
	}

	public get type() {
		return this.action.type || URL_FORM_ENCODED_TYPE;
	}


	/**
	 * Mutate the fields of this form, merging the `update` record into the existing fields
	 * @param update The record to merge
	 */
	public updateFields(update: Partial<T>) {
		if (!isEmpty(update)) {
			this.values = Object.assign({}, this.values, update);
		}

		return this.values;
	}

	/**
	 * Serializes the field values using either FormData for File objects, or a POJO otherwise
	 */
	public serialize() {
		const serializedFields = this.onSerialize(this.values);

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
	 * Hook for any custom value transformation for proper serialization
	 * For example, this function could properly format a JavaScript Date string for the server.
	 *
	 * MAY be overridden by an extending class
	 *
	 * @param values The values of the form
	 * @returns The tranformed values
	 */
	protected onSerialize(values: T): T {
		return values;
	}
}

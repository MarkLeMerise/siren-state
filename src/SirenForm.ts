import { toString } from 'lodash';
import { v4 } from 'uuid';
import { EHttpVerb, isMethodInProtocol } from './EHttpVerb';
import { Siren } from './Siren';

export interface ISirenFormFieldSet {
    [key: string]: object | string | number | boolean | File | null;
}

export interface ISirenForm<T extends ISirenFormFieldSet = {}> {
    readonly fields: Partial<T>;
    id: string;
    name: string;
    href: string;
    method: EHttpVerb;
    response: Response;
    type: string;
    updateFields(update: Partial<T>): void;
    serialize(): object;
}

function isNullOrUndefined(obj: any): obj is null | undefined {
    return obj === null || obj === undefined;
}

function hasFileField(fields: object) {
    return Object.values(fields).some(f => f instanceof File);
}

export default class SirenForm<T extends ISirenFormFieldSet> implements ISirenForm<T> {
    public id = v4();
    public fields: Partial<T> = {};
    public method: EHttpVerb;
    public name: string;
    public href: string;
    public response: Response;
    public type: string;

    constructor(action: Siren.IAction) {
        this.method = isMethodInProtocol(action.method) ? action.method : EHttpVerb.GET;
        this.name = action.name;
        this.href = action.href;
        this.type = action.type || 'application/x-www-form-urlencoded';
    }

    /**
     * Mutate the fields of this form, merging the `update` record into the existing fields
     * @param update The record to merge 
     */
    public updateFields(update: Partial<T>) {
        this.fields = Object.assign({}, this.fields, update);
    }

    /**
     * Hook for any custom field transformation for proper serialization
     * For example, this function could properly format a JavaScript Date string for the server.
     * MAY be overridden by an extending class
     *
     * @param fields The fields of the form
     * @returns The tranformed fields
     */
    protected onSerialize(fields: Partial<T>): Partial<T> {
        return fields;
    }

    public serialize() {
        let { fields } = this;
        fields = this.onSerialize(fields);

        if (hasFileField(fields)) {
            return Object.keys(fields).reduce((form, key) => {
                let value: any = fields[key];

                // After this block, `value` with either be File | string
                if (isNullOrUndefined(fields[key])) {
                    value = '';
                } else if (!(fields[key] instanceof File)) {
                    // Even though FormData stringifies everything else anyways
                    // We must stringify to pass type constraints
                    value = toString(fields[key]);
                }

                form.append(key, value);
                return form;
            }, new FormData());
        } else {
            return fields;
        }
    }
}
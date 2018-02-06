import { ISirenFormFieldSet } from './ISirenFormFieldSet';

/**
 * Defines wrapper around native Siren `action`
 *
 * @template V The allowed methods of the protocol
 * @template S The fields of the form as defined by the action
 * @template C The fields as they're stored on the client
 */
export interface ISirenForm<V = {}, S extends ISirenFormFieldSet = {}, C = S> {
	readonly action: Siren.IAction<V>;
	readonly id: string;
	readonly values: C;
	serialize(): S;
	update(update: Partial<C>): this;
}

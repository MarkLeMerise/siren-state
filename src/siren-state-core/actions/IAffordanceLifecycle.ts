import { ISirenStateAtom } from '../state/ISirenStateAtom';
import { ISirenForm } from './ISirenForm';

export interface IAffordanceLifecycle {
	/**
	 * Allows modification of the outgoing request parameters.
	 * For example, adding a `credentials` option or `Authorization` header for each request.
	 *
	 * Consumers SHOULD NOT mutate `request` but generate a new object to keep this method pure.
	 */
	onRequest: <R>(request: R, form: ISirenForm, stateAtom: ISirenStateAtom) => R;

	/**
	 * Allows inspection of `response` object before any entities have been merged into the `stateAtom`.
	 * For example, setting state based on a non-200 response.
	 *
	 * This method MAY cause side effects to the `stateAtom`.
	 */
	onResponse: <R>(response: R, form: ISirenForm, stateAtom: ISirenStateAtom) => void;
}

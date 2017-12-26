import { ISirenStateAtom } from '../ISirenStateAtom';
import { ISirenForm } from './ISirenForm';

export interface IAffordanceLifecycleHooks {
	/**
	 * Allows modification of the outgoing request parameters.
	 * For example, adding a `credentials` option or `Authorization` header for each request.
	 *
	 * This method SHOULD NOT cause side effects as `request` is immutable.
	 */
	onRequest: (request: Request, form: ISirenForm, stateAtom: ISirenStateAtom) => Request;

	/**
	 * Allows inspection of `Response` object before any entities have been merged into the `stateAtom`.
	 * For example, setting state based on a non-200 response.
	 *
	 * This method MAY cause side effects to the `stateAtom`.
	 */
	onResponse: (response: Response, form: ISirenForm, stateAtom: ISirenStateAtom) => void;
}

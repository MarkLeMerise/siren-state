import { ISirenStateAtom } from '../state/ISirenStateAtom';
import SirenForm from './SirenForm';

/**
 * Provides hooks to modify Siren action transport wrappers agnostic of the transport implementation
 *
 * @template TRequest The interface for the request transport obect wrapping the action
 * @template TResponse The interface for the response transport obect wrapping the action result
 */
export interface IAffordanceLifecycle<TRequest = any, TResponse = any> {
	/**
	 * Allows modification of the outgoing request parameters.
	 *
	 * For example, adding a `credentials` option or `Authorization` header for each request.
	 *
	 * Consumers SHOULD NOT mutate `request` but generate a new object to keep this method pure.
	 * This method SHOULD NOT cause side effects to the application state.
	 */
	onRequest: (request: TRequest, form: SirenForm, stateAtom: ISirenStateAtom) => TRequest;

	/**
	 * Allows inspection of `response` object before any entities have been merged into the `stateAtom`.
	 * Returning a falsey value will indicate the response should not be processed further or stored as a Siren entity.
	 *
	 * For example, a non-Siren HTTP response in an error scenario can be handled differently.
	 *
	 * This method MAY cause side effects to the application state.
	 */
	onResponse: (response: TResponse, form: SirenForm, stateAtom: ISirenStateAtom) => TResponse;
}

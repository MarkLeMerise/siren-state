import SirenForm from './SirenForm';

/**
 * Defines how a particular transport mechanism generates requests, sends them to a Siren API, and returns a response.
 * This interface assumes a standard request-response cycle with a Siren API.
 */
export interface IActionInitiator<TRequest = any, TResponse = any> {
	/**
	 * Creates the request abstraction used by the transport mechanism (e.g. HTTP `Request` object)
	 *
	 * @param form The form passed to the action initiator
	 */
	generateRequest: (form: SirenForm) => TRequest;

	/**
	 * Sends the `request` to a Siren API
	 *
	 * (e.g. `fetch` for HTTP)
	 *
	 * @param request The request
	 * @param form The form used to generate the request
	 */
	initiate: (request: TRequest, form: SirenForm) => Promise<TResponse>;

	/**
	 * Defines how a Siren entity is extracted from a `reponse`.
	 *
	 * @param response The response
	 * @param request The request
	 * @param form The form used to generate the request
	 */
	extractEntity: (response: TResponse, request: TRequest, form: SirenForm) => Promise<Siren.IEntity>;
}

import * as log from 'loglevel';
import { stringify } from 'querystring';
import 'url-search-params';
import { IActionInitiator } from '../siren-state-core/actions/IActionInitiator';
import { FORM_URLENCODED_CONTENT_TYPE, MULTIPART_CONTENT_TYPE, SIREN_CONTENT_TYPE } from './contentTypes';
import createFormDataObject from './createFormDataObject';
import { EHttpMethod } from './EHttpMethod';
import SirenHttpForm from './SirenHttpForm';

/**
 * Builds up a `Request` object based on the HTTP method and invokes the request
 *
 * @param form The form
 * @param stateAtom The state atom
 * @param lifecycle Hooks to invoke during the process
 *
 * @throws If the appropriate `Content-Type` cannot be determined
 */
const HttpActionInitiator: IActionInitiator<Request, Response> = {
	extractEntity: (response: Response) => response.json(),

	generateRequest: (form: SirenHttpForm) => {
		const formValues = form.serialize();
		const contentType = form.action.type || form.action.fields && FORM_URLENCODED_CONTENT_TYPE;
		let url = form.action.href;

		const init: RequestInit = {
			headers: new Headers({ Accept: SIREN_CONTENT_TYPE }),
			method: form.action.method,
		};

		if (form.action.method === EHttpMethod.GET) {
			if (Object.keys(formValues).length) {
				url = `${ form.action.href }?${ stringify(formValues) }`;
			}
		} else {
			switch (contentType) {
				case FORM_URLENCODED_CONTENT_TYPE: {
					init.body = new URLSearchParams(formValues);
					break;
				}
				case MULTIPART_CONTENT_TYPE: {
					init.body = createFormDataObject(form);
					break;
				}
				default: {
					init.body = JSON.stringify(formValues);
				}
			}

			if (contentType) {
				(init.headers as Headers).set('Content-Type', contentType);
			} else {
				log.warn(`"${ form.action.name }" action definition has no "type" property which may cause issues.`);
			}
		}

		return new Request(url, init);
	},

	initiate: (request: Request) => fetch(request),
};

export default HttpActionInitiator;

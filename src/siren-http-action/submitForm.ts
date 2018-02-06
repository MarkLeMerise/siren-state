import * as log from 'loglevel';
import { stringify } from 'querystring';
import { IAffordanceLifecycle } from '../siren-state-core/actions/IAffordanceLifecycle';
import { ISirenStateAtom } from '../siren-state-core/state/ISirenStateAtom';
import { EHttpVerb } from './EHttpVerb';
import SirenHttpForm from './SirenHttpForm';

const MULTIPART_CONTENT_TYPE = 'multipart/form-data';
const SIREN_CONTENT_TYPE = 'application/vnd.siren+json';
const URL_FORM_ENCODED_TYPE = 'application/x-www-form-urlencoded';

export default async function submitForm(
	form: SirenHttpForm,
	stateAtom: ISirenStateAtom,
	lifecycle: IAffordanceLifecycle): Promise<Siren.IEntity> {

	const body = form.serialize();
	let url = form.action.href;
	let contentType = form.action.type || form.action.fields && URL_FORM_ENCODED_TYPE;

	const init: RequestInit = {
		headers: new Headers({ Accept: SIREN_CONTENT_TYPE }),
		method: form.action.method,
	};

	if (form.action.method === EHttpVerb.GET) {
		if (Object.keys(body).length) {
			url = `${ form.action.href }?${ stringify(body) }`;
		}
	} else {
		if (body instanceof FormData) {
			init.body = body;

			if (contentType !== MULTIPART_CONTENT_TYPE) {
				log.warn('Requests with FormData should be sent with the ' +
				`"${ MULTIPART_CONTENT_TYPE }" Content-Type header. It will be automatically converted.`);
				contentType = MULTIPART_CONTENT_TYPE;
			}
		} else {
			init.body = JSON.stringify(body);
		}

		if (!contentType) {
			throw new Error('Content-Type could not be determined. Please check the action definition.');
		}

		(init.headers as Headers).set('Content-Type', contentType);
	}

	let request = new Request(url, init);
	request = lifecycle.onRequest(request, form, stateAtom);

	const response = await fetch(request);
	lifecycle.onResponse(response, form, stateAtom);

	return response.json();
}

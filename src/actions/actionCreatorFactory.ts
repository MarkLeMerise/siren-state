import { identity, isFunction, noop } from 'lodash';
import * as log from 'loglevel';
import { stringify } from 'query-string';
import { ISirenStateAtom } from '../ISirenStateAtom';
import { EHttpVerb } from '../siren-spec/EHttpVerb';
import mergeEntity from '../store/mergeEntity';
import getSelfLinkHref from '../util/getSelfLinkHref';
import { IActionCreators } from './IActionCreators';
import { IAffordanceLifecycleHooks } from './IAffordanceLifecycleHooks';
import { ISirenForm } from './ISirenForm';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';
import SirenForm from './SirenForm';

export const SIREN_CONTENT_TYPE = 'application/vnd.siren+json';
export const MULTIPART_CONTENT_TYPE = 'multipart/form-data';

export type IActionCreatorsFactory = (lifecycle: IAffordanceLifecycleHooks) => IActionCreators;
export type IFormSupplier<T extends ISirenFormFieldSet> = ISirenForm<T> |
	((stateAtom: ISirenStateAtom) => ISirenForm<T>);

const defaultLifecycle: IAffordanceLifecycleHooks = {
	onRequest: identity,
	onResponse: noop,
};

export default (stateAtom: ISirenStateAtom) =>
	(lifecycle: IAffordanceLifecycleHooks = defaultLifecycle): IActionCreators => {
		async function submitForm(form: ISirenForm) {
			const body = form.serialize();
			let url = form.action.href;

			const init: RequestInit = {
				headers: new Headers({ Accept: SIREN_CONTENT_TYPE }),
				method: form.method,
			};

			// Though seemingly opinionated, consumers can override this logic through the `onRequest` lifecycle hook
			if (form.method === EHttpVerb.GET) {
				if (Object.keys(body).length) {
					url = `${ form.action.href }?${ stringify(body) }`;
				}
			} else {
				let contentType = form.type;
				init.body = body instanceof FormData ? body : JSON.stringify(body);

				if (body instanceof FormData) {
					init.body = body;

					if (form.type !== MULTIPART_CONTENT_TYPE) {
						log.warn('Requests with FormData should be sent with the ' +
						`"${ MULTIPART_CONTENT_TYPE }" Content-Type header. It will be automatically converted.`);
						contentType = MULTIPART_CONTENT_TYPE;
					}
				} else {
					init.body = JSON.stringify(body);
				}

				(init.headers as Headers).set('Content-Type', contentType);
			}

			let request = new Request(url, init);
			request = lifecycle.onRequest(request, form, stateAtom);

			const response = await fetch(request);
			lifecycle.onResponse(response, form, stateAtom);

			const entity = await response.json() as Siren.IEntity<any>;
			mergeEntity(entity, stateAtom);

			return entity;
		}

		async function doAction<T extends ISirenFormFieldSet>(formSupplier: IFormSupplier<T>) {
			const form = isFunction(formSupplier) ? formSupplier(stateAtom) : formSupplier;
			const entity = await submitForm(form);
			const selfLinkHref = getSelfLinkHref(entity);
			stateAtom.bookkeeping.indexEntity(form.id, selfLinkHref);
		}

		function followLink(link: Siren.ILinkedEntity) {
			const form = new SirenForm({
				href: link.href,
				name: `follow-link:${ (link.class || []).join(',') }`,
			});

			submitForm(form);
		}

		return { doAction, followLink };
	};

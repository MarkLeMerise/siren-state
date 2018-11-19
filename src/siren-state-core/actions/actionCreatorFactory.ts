import { identity, isFunction } from 'lodash';
import { ISirenStateAtom } from '../state/ISirenStateAtom';
import mergeEntity from '../state/mergeEntity';
import getSelfLinkHref from '../util/getSelfLinkHref';
import { IActionCreatorsFactory } from './IActionCreatorFactory';
import { IActionCreators } from './IActionCreators';
import { IActionInitiator } from './IActionInitiator';
import { IAffordanceLifecycle } from './IAffordanceLifecycle';
import { IFormSupplier } from './IFormSupplier';
import SirenForm from './SirenForm';

const defaultLifecycle: IAffordanceLifecycle = {
	onRequest: identity,
	onResponse: identity
};

export default (stateAtom: ISirenStateAtom): IActionCreatorsFactory =>
	<TRequest, TResponse>(
		actionInitiator: IActionInitiator<TRequest, TResponse>,
		lifecycle: IAffordanceLifecycle<TRequest, TResponse> = defaultLifecycle): IActionCreators => {
		async function doAction(formSupplier: IFormSupplier) {
			const form = isFunction(formSupplier) ? formSupplier(stateAtom) : formSupplier;

			let request = actionInitiator.generateRequest(form);
			request = lifecycle.onRequest(request, form, stateAtom);

			let response = await actionInitiator.initiate(request, form);
			response = lifecycle.onResponse(response, form, stateAtom);

			if (response) {
				const entity = await actionInitiator.extractEntity(response, request, form);

				mergeEntity(entity, stateAtom);

				const selfLinkHref = getSelfLinkHref(entity);
				stateAtom.bookkeeping.indexEntity(form.id, selfLinkHref);
			}
		}

		async function followLink(link: Siren.ILinkedEntity) {
			const form = new SirenForm({
				href: link.href,
				name: `follow-link:${(link.class || []).join(',')}`,
			});

			await doAction(form);
		}

		return { doAction, followLink };
	};

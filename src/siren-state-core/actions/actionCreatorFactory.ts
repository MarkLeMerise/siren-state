import { identity, isFunction, noop } from 'lodash';
import { ISirenStateAtom } from '../state/ISirenStateAtom';
import mergeEntity from '../state/mergeEntity';
import getSelfLinkHref from '../util/getSelfLinkHref';
import { IActionCreators } from './IActionCreators';
import { IAffordanceLifecycle } from './IAffordanceLifecycle';
import { ISirenForm } from './ISirenForm';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';
import SirenForm from './SirenForm';

const defaultLifecycle = {
	onRequest: identity,
	onResponse: noop
};

export const SIREN_CONTENT_TYPE = 'application/vnd.siren+json';
export const MULTIPART_CONTENT_TYPE = 'multipart/form-data';

export type IActionCreatorsFactory = (lifecycle: IAffordanceLifecycle) => IActionCreators;
export type IFormSupplier<V = {}, S extends ISirenFormFieldSet = {}, C = S> = ISirenForm<V, S, C> |
	((stateAtom: ISirenStateAtom) => ISirenForm<V, S, C>);
export type IFormSubmitter = (form: ISirenForm, state: ISirenStateAtom, lifecycle: IAffordanceLifecycle) => Siren.IEntity;

export default (stateAtom: ISirenStateAtom) =>
	(submitForm: IFormSubmitter, lifecycle: IAffordanceLifecycle = defaultLifecycle): IActionCreators => {
		async function doAction(formSupplier: IFormSupplier) {
			const form = isFunction(formSupplier) ? formSupplier(stateAtom) : formSupplier;
			const entity = await submitForm(form, stateAtom, lifecycle);

			mergeEntity(entity, stateAtom);

			const selfLinkHref = getSelfLinkHref(entity);
			stateAtom.bookkeeping.indexEntity(form.id, selfLinkHref);
		}

		async function followLink(link: Siren.ILinkedEntity) {
			const form = new SirenForm({
				href: link.href,
				name: `follow-link:${ (link.class || []).join(',') }`,
			});

			await submitForm(form, stateAtom, lifecycle);
		}

		return { doAction, followLink };
	};

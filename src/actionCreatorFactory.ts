import { identity, noop, isFunction } from 'lodash';
import { stringify } from 'query-string';
import { EHttpVerb } from './EHttpVerb';
import getSelfLinkHref from './getSelfLinkHref';
import mergeEntity from './mergeEntity';
import { Siren } from './Siren';
import SirenForm, { ISirenForm, ISirenFormFieldSet } from './SirenForm';
import { ISirenStateAtom } from './ISirenStateAtom';

export const SIREN_CONTENT_TYPE = 'application/vnd.siren+json';
export const MULTIPART_CONTENT_TYPE = 'multipart/form-data';

export type IFormSupplier<T extends ISirenFormFieldSet> = ISirenForm<T> | ((stateAtom: ISirenStateAtom) => ISirenForm<T>);

export interface IActionCreators {
    /**
     * Executes a Siren action affordance
     */
    doAction<T extends ISirenFormFieldSet>(formSupplier: IFormSupplier<T>): void;

    /**
     * Loads an entity through a Siren link affordance
     */
    followLink(link: Siren.ILinkedEntity): void;
}

export interface IEntityLifecycleHooks {
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

const defaultLifecycle: IEntityLifecycleHooks = {
    onRequest: identity,
    onResponse: noop,
};

export default (stateAtom: ISirenStateAtom) => (lifecycle: IEntityLifecycleHooks = defaultLifecycle): IActionCreators => {
    async function submitForm(form: ISirenForm) {
        const body = form.serialize();
        let url = form.href;

        let init: RequestInit = {
            headers: new Headers({ 'Accept': SIREN_CONTENT_TYPE }),
            method: form.method,
        };

        // Though seemingly opinionated, consumers can override this logic through the `onRequest` lifecycle hook
        if (form.method === EHttpVerb.GET) {
            if (Object.keys(body).length) {
                url = `${ form.href }?${ stringify(body) }`;
            }
        } else {
            let contentType = form.type;
            init.body = body instanceof FormData ? body : JSON.stringify(body);

            if (body instanceof FormData) {
                init.body = body;
                
                if (form.type !== MULTIPART_CONTENT_TYPE) {
                    console.warn(`[siren-mobx] Requests with FormData should be sent with the "${ MULTIPART_CONTENT_TYPE }" Content-Type header. It will be automatically converted.`);
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
            name: `follow-link:${ (link.class || []).join(',') }`,
            href: link.href
        });

        submitForm(form);
    }

    return { doAction, followLink };
};

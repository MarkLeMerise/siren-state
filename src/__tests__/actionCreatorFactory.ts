jest.mock('../mergeEntity');

import actionCreatorFactory, { IActionCreators, IEntityLifecycleHooks, SIREN_CONTENT_TYPE, MULTIPART_CONTENT_TYPE } from "../actionCreatorFactory";
import SirenForm, { ISirenForm } from "../SirenForm";
import * as Chance from 'chance';
import { createSirenStateAtom } from "../../index";
import { ISirenStateAtom } from "../ISirenStateAtom";
import { stringify } from "query-string";
import { identity } from "lodash";
import mergeEntity from '../mergeEntity';
import { Siren } from "../Siren";
import { EHttpVerb } from "../EHttpVerb";

interface JestFetchMockParams {
    status?: number;
    statusText?: string;
    url?: string;
    headers?: Object;
}

interface JestFetchMockFactory<T extends typeof fetch> {
    mockReject(): jest.Mock<T>;
    mockRejectOnce(): jest.Mock<T>;
    mockResponse(body: string, init?: JestFetchMockParams): jest.Mock<T>;
    mockResponseOnce(body: string, init?: JestFetchMockParams): jest.Mock<T>;
    mockResponses(responses: Array<{body: string, init?: JestFetchMockParams}>): jest.Mock<T>;
    resetMocks(): void;
}

const fetchMockFactory: JestFetchMockFactory<typeof fetch> = fetch as any;
const chance = new Chance();

describe(actionCreatorFactory.name, () => {
    let state: ISirenStateAtom;
    let actionCreators: IActionCreators;
    let fetchMock: jest.Mock<typeof fetch>;
    let lifecycleHooks: IEntityLifecycleHooks;

    const getRequest = (): Request => fetchMock.mock.calls[0][0];

    beforeEach(() => {
        lifecycleHooks = {
            onRequest: jest.fn().mockImplementation(identity),
            onResponse: jest.fn()
        };
        state = createSirenStateAtom()
        actionCreators = actionCreatorFactory(state)(lifecycleHooks);
    });

    afterEach(() => fetchMockFactory.resetMocks());

    describe('Doing a GET request with a query string', () => {
        let form: ISirenForm<{
            age: number;
            address: string;
        }>;
        let body: Siren.IEntity;

        beforeEach(() => {
            form = new SirenForm({
                name: chance.word(),
                href: chance.url()
            });

            body = {
                class: [chance.word()],
                links: [{
                    href: chance.url(),
                    rel: ['self']
                }]
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify(body));
            form.updateFields({ age: chance.natural(), address: chance.address() });

            // Act
            return actionCreators.doAction(form);
        });

        it('should set the "Accept" header to the Siren content type', () => {
            expect(getRequest().headers.get('Accept')).toBe(SIREN_CONTENT_TYPE);
        });

        it('should not set the "Content-Type" header', () => {
            expect(getRequest().headers.get('Content-Type')).toBeFalsy();
        });

        it('should append the query string to the request URL', () => {
            expect(getRequest().url).toBe(`${ form.href }?${ stringify(form.serialize()) }`);
        });
        
        it('should call the `onRequest` lifecycle hook', () => {
            expect(lifecycleHooks.onRequest).toHaveBeenCalledWith(expect.any(Request), form, state);
        });

        it('should make a GET request', () => {
            expect(getRequest().method).toBe(EHttpVerb.GET);
        });

        it('should call the `onResponse` lifecycle hook', () => {
            expect(lifecycleHooks.onResponse).toHaveBeenCalledWith(expect.any(Response), form, state);
        });

        it('should call `mergeEntity`', () => {
            expect(mergeEntity).toHaveBeenCalledWith(expect.objectContaining(body), state);
        });

        it('should try to index the response entity using the form ID and self-link', () => {
            expect(state.bookkeeping.getEntry(form.id)).toBeTruthy();
        });
    });

    describe('Doing a GET request without a query string', () => {
        let body: Siren.IEntity;
        let form: ISirenForm;
        let selfLinkHref: string;

        beforeEach(() => {
            form = new SirenForm({
                name: chance.word(),
                href: chance.url()
            });

            selfLinkHref = chance.url();

            body = {
                class: [chance.word()],
                links: [{
                    href: selfLinkHref,
                    rel: ['self']
                }]
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify(body));

            // Act
            return actionCreators.doAction(form);
        });

        it('should not append any query string (including "?") into the URL', () => {
            expect(getRequest().url).toBe(form.href);
        });

        it('should call the `onRequest` lifecycle hook', () => {
            expect(lifecycleHooks.onRequest).toHaveBeenCalledTimes(1);
        });

        it('should make a GET request', () => {
            expect(getRequest().method).toBe(EHttpVerb.GET);
        });

        it('should call the `onResponse` lifecycle hook', () => {
            expect(lifecycleHooks.onResponse).toHaveBeenCalledTimes(1);
        });

        it('should call `mergeEntity`', () => {
            expect(mergeEntity).toHaveBeenCalledWith(expect.objectContaining(body), state);
        });

        it('should try to index the response entity using the form ID and self-link', () => {
            expect(state.bookkeeping.getEntry(form.id)).toBe(selfLinkHref);
        });
    });

    describe('Doing a POST request with a body with scalar values', () => {
        let form: ISirenForm<{
            age: number;
            address: string;
        }>;
        let response: Siren.IEntity;
        let selfLinkHref: string;

        beforeEach(() => {
            form = new SirenForm({
                name: chance.word(),
                method: EHttpVerb.POST,
                href: chance.url(),
                type: 'application/json'
            });

            selfLinkHref = chance.url();

            response = {
                class: [chance.word()],
                links: [{
                    href: selfLinkHref,
                    rel: ['self']
                }]
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify(response));
            form.updateFields({ age: chance.natural(), address: chance.address() });

            // Act
            return actionCreators.doAction(form);
        });

        it('should set the "Accept" header to the Siren content type', () => {
            expect(getRequest().headers.get('Accept')).toBe(SIREN_CONTENT_TYPE);
        });

        it('should set the "Content-Type" header to the type of the form', () => {
            expect(getRequest().headers.get('Content-Type')).toBe(form.type);
        });

        it('should not append any query string (including "?") into the URL', () => {
            expect(getRequest().url).toBe(form.href);
        });

        it('should call the `onRequest` lifecycle hook', () => {
            expect(lifecycleHooks.onRequest).toHaveBeenCalledWith(getRequest(), form, state);
        });

        it('should make a POST request', () => {
            expect(getRequest().method).toBe(EHttpVerb.POST);
        });

        it('should set the body using a plain object', async () => {
            expect(await getRequest().json()).toEqual(form.serialize());
        });

        it('should call the `onResponse` lifecycle hook', () => {
            expect(lifecycleHooks.onResponse).toHaveBeenCalledWith(expect.any(Response), form, state);
        });

        it('should call `mergeEntity`', () => {
            expect(mergeEntity).toHaveBeenCalledWith(expect.objectContaining(response), state);
        });

        it('should try to index the response entity using the form ID and self-link', () => {
            expect(state.bookkeeping.getEntry(form.id)).toBe(selfLinkHref);
        });
    });

    describe('Doing a POST request with a File in the body', () => {
        let form: ISirenForm<{
            image: File;
            address: string;
        }>;
        let body: Siren.IEntity;
        let selfLinkHref: string;
        let consoleSpy: jest.Mock;

        beforeEach(() => {
            form = new SirenForm({
                name: chance.word(),
                method: EHttpVerb.POST,
                href: chance.url(),
                type: 'application/json'
            });

            selfLinkHref = chance.url();
            consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            body = {
                class: [chance.word()],
                links: [{
                    href: selfLinkHref,
                    rel: ['self']
                }]
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify(body));
            form.updateFields({ image: new File(['abc'], 'test.png'), address: chance.address() });

            // Act
            return actionCreators.doAction(form);
        });

        it('should set the "Accept" header to the Siren content type', () => {
            expect(getRequest().headers.get('Accept')).toBe(SIREN_CONTENT_TYPE);
        });

        it(`should force the "Content-Type" header to "${ MULTIPART_CONTENT_TYPE }" even if the form type was different`, () => {
            expect(getRequest().headers.get('Content-Type')).toBe(MULTIPART_CONTENT_TYPE);
        });

        it('should console.warn the consumer about the "Content-Type" mismatch', () => {
            expect(consoleSpy).toHaveBeenCalled();
        });

        it('should not append any query string (including "?") into the URL', () => {
            expect(getRequest().url).toBe(form.href);
        });
        
        it('should call the `onRequest` lifecycle hook', () => {
            expect(lifecycleHooks.onRequest).toHaveBeenCalledWith(getRequest(), form, state);
        });

        it('should make a POST request', () => {
            expect(getRequest().method).toBe(EHttpVerb.POST);
        });

        it('should set the body using a FormData object', async () => {
            // TODO: Remove this `any` cast once Request.body is supported by TypeScript
            expect((getRequest() as any).body).toBeInstanceOf(FormData);
        });

        it('should call the `onResponse` lifecycle hook', () => {
            expect(lifecycleHooks.onResponse).toHaveBeenCalledWith(expect.any(Response), form, state);
        });

        it('should call `mergeEntity`', () => {
            expect(mergeEntity).toHaveBeenCalledWith(expect.objectContaining(body), state);
        });

        it('should try to index the response entity using the form ID and self-link', () => {
            expect(state.bookkeeping.getEntry(form.id)).toBe(selfLinkHref);
        });
    });

    describe('Modifying the request through the `onRequest` hook', () => {
        let clonedRequest: Request;

        beforeEach(() => {
            lifecycleHooks.onRequest = request => {
                clonedRequest = request.clone();
                return clonedRequest;
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify({}));
            return actionCreators.doAction(new SirenForm({
                name: chance.word(),
                href: chance.url()
            }));
        });

        it('should make the request with the modified request object', () => {
            expect(getRequest()).toBe(clonedRequest);
        });
    });

    describe('Following a link', () => {
        let link: Siren.ILinkedEntity;
        let response: Siren.IEntity;

        beforeEach(() => {
            link = {
                href: chance.url(),
                rel: [chance.word()]
            };

            response = {
                links: [{
                    rel: ['self'],
                    href: link.href
                }]
            };

            fetchMock = fetchMockFactory.mockResponse(JSON.stringify(response));
            actionCreators.followLink(link);
        });

        it('should send a GET request', () => {
            expect(getRequest().method).toBe(EHttpVerb.GET);
        });

        it('should use the link\'s href as the URL', () => {
            expect(getRequest().url).toBe(link.href);
        });

        it('should set the "Accept" header to the Siren content type', () => {
            expect(getRequest().headers.get('Accept')).toBe(SIREN_CONTENT_TYPE);
        });

        it('should not set any "Content-Type" header', () => {
            expect(getRequest().headers.get('Content-Type')).toBeFalsy();
        });

        it('should call the `onRequest` lifecycle hook', () => {
            expect(lifecycleHooks.onRequest).toHaveBeenCalledWith(getRequest(), expect.any(SirenForm), state);
        });

        it('should call the `onResponse` lifecycle hook', () => {
            expect(lifecycleHooks.onResponse).toHaveBeenCalledWith(expect.any(Response), expect.any(SirenForm), state);
        });

        it('should call `mergeEntity`', () => {
            expect(mergeEntity).toHaveBeenCalledWith(expect.objectContaining(response), state);
        });

        it('should not index the entity because it would be inaccessible to consumers', () => {
            expect(state.bookkeeping.getEntry(link.href)).toBeFalsy();
        });
    });
});
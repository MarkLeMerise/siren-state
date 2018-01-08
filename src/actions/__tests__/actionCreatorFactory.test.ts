jest.mock('../../store/mergeEntity');
jest.mock('loglevel');

import { identity, noop } from 'lodash';
import * as log from 'loglevel';
import { stringify } from 'query-string';
import { createSirenStateAtom } from '../../../index';
import { ISirenStateAtom } from '../../ISirenStateAtom';
import { EHttpVerb } from '../../siren-spec/EHttpVerb';
import mergeEntity from '../../store/mergeEntity';
import actionCreatorFactory, { MULTIPART_CONTENT_TYPE, SIREN_CONTENT_TYPE } from '../actionCreatorFactory';
import { IActionCreators } from '../IActionCreators';
import { IAffordanceLifecycleHooks } from '../IAffordanceLifecycleHooks';
import { ISirenForm } from '../ISirenForm';
import SirenForm from '../SirenForm';

interface IJestFetchMockParams {
	status?: number;
	statusText?: string;
	url?: string;
	headers?: object;
}

interface IJestFetchMockFactory<T extends typeof fetch> {
	mockReject(): jest.Mock<T>;
	mockRejectOnce(): jest.Mock<T>;
	mockResponse(body: string, init?: IJestFetchMockParams): jest.Mock<T>;
	mockResponseOnce(body: string, init?: IJestFetchMockParams): jest.Mock<T>;
	mockResponses(responses: Array<{body: string, init?: IJestFetchMockParams}>): jest.Mock<T>;
	resetMocks(): void;
}

const fetchMockFactory: IJestFetchMockFactory<typeof fetch> = fetch as any;

describe(actionCreatorFactory.name, () => {
	let state: ISirenStateAtom;
	let actionCreators: IActionCreators;
	let fetchMock: jest.Mock<typeof fetch>;
	let lifecycleHooks: IAffordanceLifecycleHooks;

	const getRequest = (): Request => fetchMock.mock.calls[0][0];

	beforeEach(() => {
		lifecycleHooks = {
			onRequest: jest.fn().mockImplementation(identity),
			onResponse: jest.fn(),
		};
		state = createSirenStateAtom();
		actionCreators = actionCreatorFactory(state)(lifecycleHooks);
	});

	afterEach(() => fetchMockFactory.resetMocks());

	describe('Doing a GET request with a query string', () => {
		let form: ISirenForm<{
			address: string;
			age: number;
		}>;
		let body: Siren.IEntity;

		beforeEach(() => {
			form = new SirenForm({
				href: chance.url(),
				name: chance.word(),
			});

			body = {
				class: [chance.word()],
				links: [{
					href: chance.url(),
					rel: ['self'],
				}],
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
				href: chance.url(),
				name: chance.word(),
			});

			selfLinkHref = chance.url();

			body = {
				class: [chance.word()],
				links: [{
					href: selfLinkHref,
					rel: ['self'],
				}],
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
				href: chance.url(),
				method: EHttpVerb.POST,
				name: chance.word(),
				type: 'application/json',
			});

			selfLinkHref = chance.url();

			response = {
				class: [chance.word()],
				links: [{
					href: selfLinkHref,
					rel: ['self'],
				}],
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
			address: string;
			image: File;
		}>;
		let body: Siren.IEntity;
		let selfLinkHref: string;

		beforeEach(() => {
			form = new SirenForm({
				href: chance.url(),
				method: EHttpVerb.POST,
				name: chance.word(),
				type: 'application/json',
			});

			selfLinkHref = chance.url();

			body = {
				class: [chance.word()],
				links: [{
					href: selfLinkHref,
					rel: ['self'],
				}],
			};

			fetchMock = fetchMockFactory.mockResponse(JSON.stringify(body));
			form.updateFields({ image: new File(['abc'], 'test.png'), address: chance.address() });

			// Act
			return actionCreators.doAction(form);
		});

		it('should set the "Accept" header to the Siren content type', () => {
			expect(getRequest().headers.get('Accept')).toBe(SIREN_CONTENT_TYPE);
		});

		it(`should force the "Content-Type" header to be "${ MULTIPART_CONTENT_TYPE }"`, () => {
			expect(getRequest().headers.get('Content-Type')).toBe(MULTIPART_CONTENT_TYPE);
		});

		it('should log a warning for the consumer about the "Content-Type" mismatch', () => {
			expect(log.warn).toHaveBeenCalled();
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
			lifecycleHooks.onRequest = (request) => {
				clonedRequest = request.clone();
				return clonedRequest;
			};

			fetchMock = fetchMockFactory.mockResponse(JSON.stringify({}));
			return actionCreators.doAction(new SirenForm({
				href: chance.url(),
				name: chance.word(),
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
				rel: [chance.word()],
			};

			response = {
				links: [{
					href: link.href,
					rel: ['self'],
				}],
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

	describe('Using a form supplier function', () => {
		let myForm: ISirenForm;

		beforeEach(() => {
			myForm = new SirenForm({
				href: chance.url(),
				name: chance.word()
			});
			fetchMock = fetchMockFactory.mockResponse(JSON.stringify({}));

			return actionCreators.doAction(() => myForm);
		});

		it('should use the SirenForm returned from the function', () => {
			expect(lifecycleHooks.onRequest).toHaveBeenCalledWith(expect.any(Request), myForm, state);
		});
	});
});

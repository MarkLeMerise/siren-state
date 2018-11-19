jest.mock('loglevel');

import generateAction from '../../../test-util/generateAction';
import { EHttpMethod } from '../EHttpMethod';
import HttpActionInitiator from '../HttpActionInitiator';
import SirenHttpForm from '../SirenHttpForm';

describe('HttpActionInitiator', () => {
	describe('Generating an HTTP Request object', () => {
		let request: Request;
		let form: SirenHttpForm;
		let action: Siren.IAction<EHttpMethod>;
		const act = () => request = HttpActionInitiator.generateRequest(form);

		describe('For a read-type (GET) request', () => {
			beforeEach(() => {
				action = generateAction();
				action.method = EHttpMethod.GET;
				action.fields = [
					{ name: chance.word(), value: chance.word() }
				];
				form = new SirenHttpForm(action);
				act();
			});

			it('should generate a GET-type request', () => {
				expect(request.method).toBe(EHttpMethod.GET);
			});

			it('should set the request URL with a query string', () => {
				expect(request.url).toBe(`${ action.href }?${ action.fields![0].name }=${ action.fields![0].value }`);
			});

			it('should not set a Content-Type header', () => {
				expect(request.headers.get('Content-Type')).toBeNull();
			});
		});

		// describe('For a write-type request', () => {
		// 	describe(`And the content type is ${ FORM_URLENCODED_CONTENT_TYPE }`, () => {});
		// 	describe(`And the content type is ${ MULTIPART_CONTENT_TYPE }`, () => {});
		// 	describe('And the content type anything else', () => {});
		// });
	});

	// HttpActionInitiator.initiate(request, form);
	// HttpActionInitiator.extractEntity(response, request, form);
});

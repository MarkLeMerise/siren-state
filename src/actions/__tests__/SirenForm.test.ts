import { EHttpVerb } from '../../siren-spec/EHttpVerb';
import { ISirenForm } from '../ISirenForm';
import { ISirenFormFieldSet } from '../ISirenFormFieldSet';
import SirenForm, { URL_FORM_ENCODED_TYPE } from '../SirenForm';

interface IPerson extends ISirenFormFieldSet {
	age: number;
	color: string;
	name: string;
	weight: number | null;
}

interface IExtendedPerson extends IPerson {
	address: { street: string };
	image: File;
}

describe(SirenForm.name, () => {
	let action: Siren.IAction;

	beforeEach(() => {
		action = {
			href: chance.word(),
			name: chance.word(),
		};
	});

	describe('Constructing a form from a Siren action', () => {
		describe('And a populated, spec-compliant Siren action is provided', () => {
			let form: ISirenForm;

			beforeEach(() => {
				Object.assign(action, {
					method: EHttpVerb.POST,
					type: chance.sentence(),
				});

				form = new SirenForm(action);
			});

			it('should set the "name" property to be the same as the Siren action', () => {
				expect(form.action.name).toBe(action.name);
			});

			it('should set the "href" property to be the same as the Siren action', () => {
				expect(form.action.href).toBe(action.href);
			});

			it('should set the "type" property to be the same as the Siren action', () => {
				expect(form.type).toBe(action.type);
			});

			it('should set the "method" property to be the same as the Siren action', () => {
				expect(form.method).toBe(action.method);
			});
		});

		describe('With fields that have values', () => {
			let form: ISirenForm<IPerson>;

			beforeEach(() => {
				Object.assign(action, {
					fields: [
						{ name: 'age', value: chance.natural() },
						{ name: 'weight', value: null },
						{ name: 'color' },
					],
				});

				form = new SirenForm(action);
			});

			it('should copy a populated value as-is', () => {
				expect(form.values.age).toBe(action.fields![0].value);
			});

			it('should maintain `null` as a value', () => {
				expect(form.values.weight).toBeNull();
			});

			it('should set fields without a "value" to `null`', () => {
				expect(form.values.color).toBeNull();
			});
		});

		describe('With an empty "fields" property', () => {
			let form: ISirenForm;

			beforeEach(() => {
				action.fields = [];
				form = new SirenForm(action);
			});

			it('should create an empty object as the initial field values', () => {
				expect(form.values).toEqual({});
			});
		});

		describe('And only the required fields are provided in the Siren action', () => {
			let form: ISirenForm;

			beforeEach(() => {
				form = new SirenForm(action);
			});

			it(`should default to using ${ URL_FORM_ENCODED_TYPE } per the Siren spec`, () => {
				expect(form.type).toBe(URL_FORM_ENCODED_TYPE);
			});

			it(`should default to using the "GET" HTTP method per the Siren spec`, () => {
				expect(form.method).toBe(EHttpVerb.GET);
			});
		});

		describe('And an object missing the required fields is passed into the constructor', () => {
			it('should throw an error', () => {
				// This is basically impossible with TypeScript, but we test for non-TypeScript consumers.
				expect(() => new SirenForm({} as any)).toThrowError();
			});
		});
	});

	describe('Serializing a form', () => {
		describe('And the form contains a File object', () => {
			let form: ISirenForm<IExtendedPerson>;
			let formData: FormData;
			let updateRecord: Partial<IExtendedPerson>;

			beforeEach(() => {
				form = new SirenForm(action);

				updateRecord = {
					address: { street: chance.address() },
					age: 0,
					color: undefined,
					image: new File(['abc'], 'image.png'),
					name: chance.name(),
					weight: null,
				};

				form.updateFields(updateRecord);
				formData = form.serialize() as FormData;
			});

			it('should serialize the form as a FormData object', () => {
				expect(formData).toBeInstanceOf(FormData);
			});

			it('should convert `null` or `undefined` values to an empty string', () => {
				expect(formData.get('weight')).toBe('');
				expect(formData.get('color')).toBe('');
			});

			it('should convert numbers to strings', () => {
				expect(formData.get('age')).toBe(updateRecord.age!.toString());
			});

			it('should convert objects to strings', () => {
				expect(formData.get('address')).toBe(JSON.stringify(updateRecord.address));
			});

			it('should add the File object as-is', () => {
				expect(formData.get('image')).toBe(updateRecord.image);
			});
		});

		describe('And the form is just scalar values', () => {
			let updateRecord: Partial<IPerson>;
			let form: ISirenForm;

			beforeEach(() => {
				form = new SirenForm(action);

				updateRecord = {
					age: 0,
					color: undefined,
					name: chance.name(),
					weight: null,
				};

				form.updateFields(updateRecord);
			});

			it('should serialize as a vanilla JavaScript object', () => {
				expect(form.serialize()).toEqual(updateRecord);
			});
		});

		describe('And the output is transformed via the "onSerialize" lifecycle hook', () => {
			class MyForm extends SirenForm<IExtendedPerson> {
				protected onSerialize(fields: IExtendedPerson): IExtendedPerson {
					return Object.assign({}, fields, {
						address: { street: chance.address() },
						age: fields.age * 2,
					});
				}
			}

			let form: MyForm;
			let updateRecord: Partial<IExtendedPerson>;

			beforeEach(() => {
				updateRecord = {
					age: chance.age(),
					weight: chance.natural(),
				};
				form = new MyForm(action);
				form.updateFields(updateRecord);
			});

			it('should use the output of the lifecycle hook', () => {
				expect(form.serialize()).toEqual({
					address: { street: expect.any(String) },
					age: updateRecord.age! * 2,
					weight: updateRecord.weight,
				});
			});
		});
	});

	describe('Updating the form', () => {
		let form: ISirenForm<IExtendedPerson>;
		let firstUpdateResult: IExtendedPerson;
		let secondUpdateResult: IExtendedPerson;

		beforeEach(() => {
			form = new SirenForm(action);
		});

		it('should set the fields to an empty object initially', () => {
			expect(form.values).toEqual({});
		});

		describe('With an update', () => {
			let firstUpdate: Partial<IExtendedPerson>;
			let secondUpdate: Partial<IExtendedPerson>;

			beforeEach(() => {
				firstUpdate = {
					age: chance.age(),
					name: chance.name(),
				};

				secondUpdate = {
					age: chance.age(),
				};

				firstUpdateResult = form.updateFields(firstUpdate);
				secondUpdateResult = form.updateFields(secondUpdate);
			});

			it('should partially update the form', () => {
				expect(form.values.age).toBe(secondUpdate.age);
				expect(form.values.name).toBe(firstUpdate.name);
			});

			it('should create a new object', () => {
				expect(firstUpdateResult).not.toBe(secondUpdateResult);
			});
		});

		describe('With an empty update', () => {
			beforeEach(() => {
				firstUpdateResult = form.values;
				secondUpdateResult = form.updateFields({});
			});

			it('should not create a new object', () => {
				expect(firstUpdateResult).toBe(secondUpdateResult);
			});
		});
	});
});

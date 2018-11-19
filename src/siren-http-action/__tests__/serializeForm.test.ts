import createFormDataObject from '../createFormDataObject';

interface IPerson {
	address: { street: string };
	age: number;
	color?: string;
	image: File;
	name: string;
	weight: number | null;
}

describe(createFormDataObject.name, () => {
	describe('And the form values contain scalar values, optionals, and a File', () => {
		let data: IPerson;
		let formData: FormData;

		beforeEach(() => {
			data = {
				address: { street: chance.address() },
				age: 0,
				color: undefined,
				image: new File(['abc'], 'image.png'),
				name: chance.name(),
				weight: null,
			};

			formData = createFormDataObject(data);
		});

		it('should serialize the form as a FormData object', () => {
			expect(formData).toBeInstanceOf(FormData);
		});

		it('should convert `null` or `undefined` values to an empty string', () => {
			expect(formData.get('weight')).toBe('');
			expect(formData.get('color')).toBe('');
		});

		it('should convert numbers to strings', () => {
			expect(formData.get('age')).toBe(data.age.toString());
		});

		it('should convert objects to strings', () => {
			expect(formData.get('address')).toBe(JSON.stringify(data.address));
		});

		it('should add the File object as-is', () => {
			expect(formData.get('image')).toBe(data.image);
		});
	});
});

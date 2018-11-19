import { SirenModel } from '../../model/SirenModel';
import createSirenStateAtom from '../../state/createSirenStateAtom';
import { ISirenStateAtom } from '../../state/ISirenStateAtom';
import { ISirenModelRegistrar } from '../ISirenModelRegistrar';
import modelRegistrationFactory from '../modelRegistrationFactory';

describe(SirenModel.name, () => {
	let stateAtom: ISirenStateAtom;
	let SirenModelRegistrar: ISirenModelRegistrar;

	beforeEach(() => {
		stateAtom = createSirenStateAtom();
		SirenModelRegistrar = modelRegistrationFactory(stateAtom);
	});

	describe('Registering a SirenModel', () => {
		// tslint:disable:max-classes-per-file
		class FakeClass extends SirenModel {}
		class FakeSubentityClass extends SirenModel {}

		describe('Without any options', () => {
			beforeEach(() => {
				SirenModelRegistrar()(FakeClass);
			});

			it('should be in the registry', () => {
				expect(stateAtom.registry.hasModelRegistered(FakeClass)).toBeTruthy();
			});

			it('should have used the kebab-cased version of the model class', () => {
				expect(stateAtom.registry.hasSirenClass('fake-class')).toBeTruthy();
			});

			it('should throw an error when trying to register a SirenModel with the same name again', () => {
				expect(() => SirenModelRegistrar()(FakeClass)).toThrow();
			});
		});

		describe('With a custom Siren class', () => {
			let sirenClass: string;

			beforeEach(() => {
				sirenClass = chance.word();
				SirenModelRegistrar({ sirenClass })(FakeClass);
			});

			it('should be in the registry', () => {
				expect(stateAtom.registry.hasModelRegistered(FakeClass)).toBeTruthy();
			});

			it('should have used the custom Siren class to store the entry', () => {
				expect(stateAtom.registry.hasSirenClass(sirenClass)).toBeTruthy();
			});

			it('should throw an error when trying to register a SirenModel with the same name again', () => {
				expect(() => SirenModelRegistrar({ sirenClass })(FakeClass)).toThrow();
			});

			it('should be added as a static property on the Type itself ', () => {
				expect(FakeClass).toHaveProperty('sirenClass', sirenClass);
			});
		});

		describe('With subentity dependencies', () => {
			let spy: jest.SpyInstance;
			let rel: string;

			beforeEach(() => {
				spy = jest.spyOn(stateAtom.registry, 'createDependency');
				rel = chance.word();

				SirenModelRegistrar()(FakeSubentityClass);
				SirenModelRegistrar({ subentities: {
					[rel]: FakeSubentityClass,
				}})(FakeClass);
			});

			it('should record the depenency', () => {
				expect(spy).toHaveBeenCalledWith(rel, FakeClass, FakeSubentityClass);
			});

			it(`should expose ${ FakeClass.name } as a dependent of ${ FakeSubentityClass.name }`, () => {
				expect(stateAtom.registry.findDependents(FakeSubentityClass)).toContain(FakeClass);
			});
		});
	});
});

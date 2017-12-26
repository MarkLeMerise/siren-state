import { SirenModel } from '../../model/SirenModel';
import { SirenModelRegistry } from '../../registration/SirenModelRegistry';
import { ISirenModelRegistry } from '../ISirenModelRegistry';
import { noop } from 'lodash';
import { ISirenModelConstructor } from '../ISirenModelConstructor';
import { ISirenModel } from '../../model/ISirenModel';

describe(SirenModelRegistry.name, () => {
	let registry: ISirenModelRegistry;

	beforeEach(() => {
		registry = new SirenModelRegistry();
	});

	describe('Registering a model', () => {
		let sirenClass: string;
		class MyFakeModel extends SirenModel {}

		describe('When it has not been registered yet', () => {
			beforeEach(() => {
				sirenClass = chance.word({ length: 4 });
				registry.registerModel(sirenClass, MyFakeModel);
			});

			it('should report that it has been registered by type', () => {
				expect(registry.hasModelRegistered(MyFakeModel)).toBeTruthy();
			});

			it('should report that it has been registered by Siren class', () => {
				expect(registry.hasSirenClass(sirenClass)).toBeTruthy();
			});

			it('should throw an error if you try to register with the same Siren class again', () => {
				expect(() => registry.registerModel(sirenClass, MyFakeModel)).toThrow();
			});

			it('should expose the registered type via its Siren class', () => {
				expect(registry.getRegisteredModel<MyFakeModel>(sirenClass)).toBe(MyFakeModel);
			});

			describe('Registering the same type with a different Siren class', () => {
				let altSirenClass: string;

				beforeEach(() => {
					altSirenClass = chance.word({ length: 3 });
					registry.registerModel(altSirenClass, MyFakeModel);
				});

				it('should report that it has been registered by type', () => {
					expect(registry.hasModelRegistered(MyFakeModel)).toBeTruthy();
				});

				it('should report that it has been registered by Siren class', () => {
					expect(registry.hasSirenClass).toBeTruthy();
				});
			});
		});
	});

	describe('Finding a model\'s dependents', () => {
		class Type1 extends SirenModel {}
		class Type2 extends SirenModel {}
		let dependents: ISirenModelConstructor<ISirenModel>[];

		describe('And both dependecy & dependent has been registered', () => {
			beforeEach(() => {
				registry.registerModel(Type1.name, Type1);
				registry.registerModel(Type2.name, Type2);
				registry.createDependency(chance.word(), Type1, Type2);
				dependents = registry.findDependents(Type2);
			});

			it('should return the dependent model definitions', () => {
				expect(dependents).toContain(Type1);
			});
		});

		describe('And a dependency has not been registered (but its dependent has)', () => {
			beforeEach(() => {
				registry.registerModel(Type1.name, Type1);
				registry.createDependency(chance.word(), Type1, Type2);
				jest.spyOn(console, 'info').mockImplementation(noop);
				dependents = registry.findDependents(Type2);
			});

			it('should inform the consumer that though it may not affect anything, this particular model is not registered', () => {
				expect(console.info).toHaveBeenCalled();
			});

			it('should still return dependent model definitions', () => {
				expect(dependents).toContain(Type1);
			});
		});

		describe('And a dependency has been registered (but its dependent has not)', () => {
			beforeEach(() => {
				registry.registerModel(Type2.name, Type2);
				registry.createDependency(chance.word(), Type1, Type2);
				jest.spyOn(console, 'warn').mockImplementation(noop);
				dependents = registry.findDependents(Type2);
			});

			it('should log a warning', () => {
				expect(console.warn).toHaveBeenCalled();
			});

			it('cannot return the dependent because the dependent is not registered', () => {
				expect(dependents).toHaveLength(0);
			});
		});
	});
});

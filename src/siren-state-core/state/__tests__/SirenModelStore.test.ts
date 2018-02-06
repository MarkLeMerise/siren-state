import { createSirenStateAtom } from '../../../index';
import generateSelfLink from '../../../test-util/generateSelfLink';
import { ISirenStateAtom } from '../../ISirenStateAtom';
import { ISirenModel } from '../../model/ISirenModel';
import { SirenModel } from '../../model/SirenModel';
import { ISirenModelStore } from '../ISirenModelStore';
import { SirenModelStore } from '../SirenModelStore';

describe(SirenModelStore.name, () => {
	let store: ISirenModelStore;

	beforeEach(() => {
		store = new SirenModelStore();
	});

	describe('Getting a model by href', () => {
		let sirenModel: ISirenModel;
		let selfLink: Siren.ILinkedEntity;

		beforeEach(() => {
			selfLink = generateSelfLink();
			sirenModel = new SirenModel({
				links: [selfLink]
			});
		});

		it('should return nothing before the model is placed in the store', () => {
			expect(store.getModelByHref(selfLink.href)).toBeUndefined();
		});

		describe('And the model is in the state', () => {
			beforeEach(() => {
				store.storeModel(sirenModel);
			});

			it('should be queryable by self-link', () => {
				expect(store.getModelByHref(selfLink.href)).toBe(sirenModel);
			});
		});
	});

	describe('Getting a set of models by its type', () => {
		let sirenModel: ISirenModel;
		let extendedModel1: ISirenModel;
		let extendedModel2: ISirenModel;
		let models: ISirenModel[];

		class ExtendedSirenModel extends SirenModel {}
		/* tslint:disable-next-line:max-classes-per-file */
		class OtherModel extends SirenModel {}

		beforeEach(() => {
			sirenModel = new SirenModel({
				links: [generateSelfLink()]
			});

			extendedModel1 = new ExtendedSirenModel({
				links: [generateSelfLink()]
			});

			extendedModel2 = new ExtendedSirenModel({
				links: [generateSelfLink()]
			});

			store.storeModel(sirenModel);
			store.storeModel(extendedModel1);
			store.storeModel(extendedModel2);
		});

		describe('And `SirenModel` is used as the `Type` parameter', () => {
			beforeEach(() => {
				models = store.getModelByType(SirenModel);
			});

			it('should return the entire model map', () => {
				expect(Object.keys(models)).toHaveLength(3);
			});
		});

		describe('And there are multiple models of that type in the state', () => {
			beforeEach(() => {
				models = store.getModelByType(ExtendedSirenModel);
			});

			it('should return a map of all the entities of that type', () => {
				expect(models).toEqual([ extendedModel1, extendedModel2 ]);
			});
		});

		describe('And there are no models of that type in the state', () => {
			beforeEach(() => {
				models = store.getModelByType(OtherModel);
			});

			it('should return an empty map', () => {
				expect(Object.keys(models)).toHaveLength(0);
			});
		});
	});

	describe('Storing a model', () => {
		let model: ISirenModel;
		let selfLink: Siren.ILinkedEntity;

		beforeEach(() => {
			selfLink = generateSelfLink();

			model = new SirenModel({
				links: [selfLink],
			}, createSirenStateAtom());

			store.storeModel(model);
		});

		it('should not replace any existing model entry', () => {
			expect(store.getModelByHref(model.selfLinkHref)).toBe(model);
		});

		describe('And then an incoming model has the same self-link', () => {
			beforeEach(() => {
				model = new SirenModel({
					links: [selfLink]
				});

				store.storeModel(model);
			});

			it('should replace the existing model entry', () => {
				expect(store.getModelByHref(model.selfLinkHref)).toBe(model);
			});

			it('should not duplicate entries', () => {
				expect(Object.values(store.getModelByType(SirenModel))).toHaveLength(1);
			});
		});

		describe('And it doesn\'t have a self-link', () => {
			it('should throw an error', () => {
				expect(() => store.storeModel(new SirenModel())).toThrow();
			});
		});
	});
});

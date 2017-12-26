import { noop } from 'lodash';
import sirenStateFactory, { ISirenState } from '../../../index';
import generateEntity from '../../../test-util/generateEntity';
import generateSelfLink from '../../../test-util/generateSelfLink';
import { SirenModel } from '../../model/SirenModel';
import mergeEntity from '../mergeEntity';
import { ISirenStateAtom } from '../../ISirenStateAtom';

describe(mergeEntity.name, () => {
	class MySirenModel extends SirenModel {}
	let sirenState: ISirenState;
	let entity: Siren.IEntity;

	beforeEach(() => {
		sirenState = sirenStateFactory();
	});

	describe('Merging an entity with a single matching Siren class definition', () => {
		beforeEach(() => {
			let sirenClass = chance.word();
			sirenState.SirenModel({ sirenClass })(MySirenModel);

			entity = {
				class: [sirenClass],
				links: [
					generateSelfLink(),
					{
						class: [chance.word()],
						href: chance.url(),
						rel: ['linked'],
					},
				],
			};

			mergeEntity(entity, sirenState.state);
		});

		it('should create a new domain model using that definition', () => {
			expect(sirenState.state.store.getModelByHref(entity.links![0].href)).toBeInstanceOf(MySirenModel);
		});

		it('should not merge any linked entities', () => {
			expect(sirenState.state.store.getModelByHref(entity.links![1].href)).toBeFalsy();
		});
	});

	describe('Merging an entity with multiple matching Siren class definitions', () => {
		/* tslint:disable-next-line:max-classes-per-file */
		class MyOtherSirenModel extends SirenModel {}

		beforeEach(() => {
			let sirenClass1 = chance.word();
			let sirenClass2 = chance.word();
			sirenState.SirenModel({ sirenClass: sirenClass1 })(MySirenModel);
			sirenState.SirenModel({ sirenClass: sirenClass2 })(MyOtherSirenModel);

			entity = {
				class: [sirenClass1, sirenClass2],
				links: [generateSelfLink()],
			};

			jest.spyOn(console, 'info').mockImplementation(noop);
			mergeEntity(entity, sirenState.state);
		});

		it('should create a new domain model using the first matching definition', () => {
			expect(sirenState.state.store.getModelByHref(entity.links![0].href)).toBeInstanceOf(MySirenModel);
		});

		it('should not create any model for the second definition', () => {
			expect(sirenState.state.store.getModelByType(MyOtherSirenModel)).toEqual([]);
		});

		it('should issue a warning about matching multiple types', () => {
			expect(console.info).toHaveBeenCalled();
		});
	});

	describe('Merging an entity with no matching Siren class definition', () => {
		beforeEach(() => {
			entity = {
				class: [chance.word()],
				links: [generateSelfLink()],
			};

			jest.spyOn(console, 'info').mockImplementation(noop);
			mergeEntity(entity, sirenState.state);
		});

		it('should log a message that no matching definition can be found', () => {
			expect(console.info).toHaveBeenCalled();
		});

		it('should still merge the entity into the store', () => {
			expect(sirenState.state.store.getModelByType(SirenModel)).toHaveLength(1);
		});
	});

	describe('Merging an entity with a registered model graph', () => {
		class Item extends SirenModel {}
		class OtherItem extends SirenModel {}
		class Collection extends SirenModel {}
		class MyCustomProcessedClass extends SirenModel {
			public onFromEntity(stateAtom?: ISirenStateAtom) {
				return next;
			}
		}

		let next: MyCustomProcessedClass;
		let customEntity: Siren.IEmbeddedEntity;
		let customEntityModel: Item;
		let spy: jest.SpyInstance;

		beforeEach(() => {
			sirenState.SirenModel()(Item);
			sirenState.SirenModel()(Collection);
			sirenState.SirenModel()(OtherItem);
			sirenState.SirenModel({
				subentities: {
					[chance.word({ length: 4 })]: Item,
					[chance.word({ length: 3 })]: OtherItem
				}
			})(MyCustomProcessedClass);

			customEntity = generateEntity(MyCustomProcessedClass);
			next = new MyCustomProcessedClass(customEntity);
			mergeEntity(customEntity, sirenState.state);
			customEntityModel = sirenState.state.store.getModelByType(MyCustomProcessedClass)[0];

			const collection = generateEntity(Collection);
			collection.entities = [
				generateEntity(Item),
				generateEntity(Item),
				generateEntity(OtherItem)
			];

			spy = jest.spyOn(customEntityModel, 'onFromEntity');

			mergeEntity(collection, sirenState.state);
		});

		it('should allow models of dependent types to re-process their entity graph (but only once)', () => {
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should replace the reference in the store with the updated one', () => {
			expect(sirenState.state.store.getModelByHref(customEntityModel.selfLinkHref)).toBe(next);
		});
	});
});

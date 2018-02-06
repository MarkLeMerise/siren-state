import EntityIndexer, { IEntityIndexer } from '../EntityIndexer';

describe(EntityIndexer.name, () => {
	let indexer: IEntityIndexer<string>;
	let key: string;
	let value: string;

	beforeEach(() => {
		key = chance.word();
		value = chance.word();
		indexer = new EntityIndexer();
	});

	describe('Indexing an entity reference', () => {
		beforeEach(() => {
			indexer.indexEntity(key, value);
		});

		it('should be retrievable by the key', () => {
			expect(indexer.getEntry(key)).toBe(value);
		});
	});

	describe('Clearing an entity reference', () => {
		beforeEach(() => {
			indexer.indexEntity(key, value);
			indexer.clearEntry(key);
		});

		it('should be no longer be retrievable by key', () => {
			expect(indexer.getEntry(key)).toBeFalsy();
		});
	});
});

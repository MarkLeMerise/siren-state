export interface IEntityIndexer<T> {
	getEntry(key: string): T | undefined;
	clearEntry(key: string): void;
	indexEntity(key: string, value: T): void;
}

interface IEntityIndexerMap<T> {
	[viewKey: string]: T;
}

/**
 * Simple key-value map for storing arbitrary references to entity self-links
 *
 * Most useful for actions which may cause the server to return a new entity whose self-link is not known
 */
export default class EntityIndexer<T = string> implements IEntityIndexer<T> {
	private index: IEntityIndexerMap<T>;

	constructor(index: IEntityIndexerMap<T> = {}) {
		this.index = index;
	}

	public getEntry(key: string) {
		return this.index[key];
	}

	public clearEntry(key: string) {
		delete this.index[key];
	}

	public indexEntity(key: string, value: T) {
		this.index[key] = value;
	}
};

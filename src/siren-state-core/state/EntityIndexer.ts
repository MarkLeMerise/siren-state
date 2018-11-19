/**
 * Simple key-value map for storing arbitrary references to entity self-links
 *
 * Most useful for actions which may cause the server to return a new entity whose self-link is not known
 */
export default class EntityIndexer {
	private index: Record<string, string>;

	constructor(index: Record<string, string> = {}) {
		this.index = index;
	}

	public getEntry(key: string) {
		return this.index[key];
	}

	public clearEntry(key: string) {
		delete this.index[key];
	}

	public indexEntity(key: string, value: string) {
		this.index[key] = value;
	}
}

export default class EmbeddedModel<T> {
	public rel: string[] = [];
	public model: T;

	constructor(rel: string[], model: T) {
		this.rel = rel;
		this.model = model;
	}

	public is(rel: string) {
		return this.rel.includes(rel);
	}
}

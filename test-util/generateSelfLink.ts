import * as Chance from 'chance';

const chance = new Chance();

export default (sirenClass: string[] = [ chance.word() ], href = chance.url()): Siren.ILinkedEntity => ({
	class: sirenClass,
	href,
	rel: ['self'],
});

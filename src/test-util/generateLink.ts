import * as Chance from 'chance';

const chance = new Chance();

/**
 * Generates a mock Siren link with the minimal required fields
 */
export default (sirenClass: string[] = [ chance.word() ], href = chance.url(), rel = [ chance.word() ]): Siren.ILinkedEntity => ({
	class: sirenClass,
	href,
	rel,
});

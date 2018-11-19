import * as Chance from 'chance';

const chance = new Chance();

/**
 * Generates a mock Siren action with the minimal required fields
 */
export default <TMethods>(name: string = chance.word(), href = chance.url()): Siren.IAction<TMethods> => ({
	href,
	name
});

import * as Chance from 'chance';

const chance = new Chance();

export default <TMethods>(name: string = chance.word(), href = chance.url()): Siren.IAction<TMethods> => ({
	href,
	name
});

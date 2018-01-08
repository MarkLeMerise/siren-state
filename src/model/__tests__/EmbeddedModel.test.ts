import EmbeddedModel from '../EmbeddedModel';
import { ISirenModel } from '../ISirenModel';
import { SirenModel } from '../SirenModel';

describe(EmbeddedModel.name, () => {
	describe('Constructing an EmbeddedModel with a particular "rel"', () => {
		let rel: string;
		let embeddedModel: EmbeddedModel<ISirenModel>;
		let sirenModel: ISirenModel;

		beforeEach(() => {
			rel = chance.word();
			sirenModel = new SirenModel();
			embeddedModel = new EmbeddedModel([rel], sirenModel);
		});

		it('should be true', () => {
			expect(embeddedModel.is(rel)).toBeTruthy();
		});

		it('should expose the model', () => {
			expect(embeddedModel.model).toBe(sirenModel);
		});
	});
});

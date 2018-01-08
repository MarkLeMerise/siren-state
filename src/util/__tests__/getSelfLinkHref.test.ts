import generateSelfLink from '../../../test-util/generateSelfLink';
import getSelfLinkHref from '../getSelfLinkHref';

describe(getSelfLinkHref.name, () => {
	let entity: Siren.IEntity;

	beforeEach(() => {
		entity = {};
	});

	describe('When an entity has links', () => {
		beforeEach(() => {
			entity.links = [];
		});

		describe('And they contain a self-link', () => {
			let selfLink: Siren.ILinkedEntity;

			beforeEach(() => {
				selfLink = generateSelfLink();
				entity.links!.push(selfLink);
			});

			it('should return the self-link href', () => {
				expect(getSelfLinkHref(entity)).toBe(selfLink.href);
			});
		});

		describe('And they do not contain a self-link', () => {
			beforeEach(() => {
				entity.links!.push({
					href: chance.url(),
					rel: [chance.word({ length: 5 })]
				});
			});

			it('should return undefined', () => {
				expect(getSelfLinkHref(entity)).toBeUndefined();
			});
		});
	});

	describe('When an entity does not have any links', () => {
		it('should return undefined', () => {
			expect(getSelfLinkHref(entity)).toBeUndefined();
		});
	});
});

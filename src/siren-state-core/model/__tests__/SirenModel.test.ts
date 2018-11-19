import generateAction from '../../../../test-util/generateAction';
import generateEntity from '../../../../test-util/generateEntity';
import generateLink from '../../../../test-util/generateLink';
import generateSelfLink from '../../../../test-util/generateSelfLink';
import { SirenModel } from '../SirenModel';

describe(SirenModel.name, () => {
	interface IPersonProps {
		age: number;
		birthday: Date | null;
		weightInStone: number;
	}

	class Person extends SirenModel<IPersonProps> {}

	describe('Constructing a Person', () => {
		let person: Person;

		describe('Without an entity', () => {
			beforeEach(() => {
				person = new Person();
			});

			it('should default properties to an empty object', () => {
				expect(person.properties).toEqual({});
			});

			it('should default actions to an empty array', () => {
				expect(person.actions).toEqual([]);
			});

			it('should default links to an empty array', () => {
				expect(person.links).toEqual([]);
			});

			it('should default entities to an empty array', () => {
				expect(person.entities).toEqual([]);
			});
		});

		describe('With a populated entity', () => {
			let actions: Siren.IAction[];
			let entities: Siren.ISubEntity[];
			let links: Siren.ILinkedEntity[];
			let properties: IPersonProps;
			let selfLink: Siren.ILinkedEntity;

			beforeEach(() => {
				selfLink = generateSelfLink();
				actions = [generateAction()];
				entities = [generateEntity(Person)];
				links = [generateLink(), selfLink];
				properties = {
					age: chance.age(),
					birthday: chance.birthday(),
					weightInStone: chance.natural()
				};

				person = new Person({
					actions,
					entities,
					links,
					properties
				});
			});

			it('should save the actions', () => {
				expect(person.actions).toEqual(actions);
			});

			it('should save the entities', () => {
				expect(person.entities).toEqual(entities);
			});

			it('should save the links', () => {
				expect(person.links).toEqual(links);
			});

			it('should save the properties', () => {
				expect(person.properties).toEqual(properties);
			});

			it('should expose the self-link', () => {
				expect(person.selfLinkHref).toBe(selfLink.href);
			});
		});
	});
});

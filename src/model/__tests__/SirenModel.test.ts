import { SirenModel } from "../SirenModel";
import { ISirenStateAtom } from "../../ISirenStateAtom";
import generateSelfLink from "../../../test-util/generateSelfLink";

describe(SirenModel.name, () => {
	interface IPersonProps {
		age: number;
		birthday: Date | null;
		weightInStone: number;
	}

	interface ISirenPersonProps {
		age: number;
		birthday: string;
		name: string;
		weight: {
			lbs: number;
			kg: number;
		};
	}

	class Person extends SirenModel<IPersonProps, ISirenPersonProps> {
		protected onTransformProperties(incoming: Partial<ISirenPersonProps>) {
			return {
				age: incoming.age,
				birthday: incoming.birthday ? new Date(incoming.birthday) : null,
				weightInStone: incoming.weight!.kg ? incoming.weight!.kg / 6.35029 : 0
			};
		}

		public onFromEntity(state?: ISirenStateAtom) {
			return this;
		}
	}

	describe('Constructing a Person', () => {
		let person: Person;

		describe('Without properties, links, actions, or entities', () => {
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

		describe('With properties', () => {
			beforeEach(() => {
				person = new Person({
					properties: {
						age: chance.age(),
						birthday: chance.date().toISOString(),
						name: chance.name(),
						weight: {
							kg: chance.natural({ max: 100 }),
							lbs: chance.natural({ max: 250 })
						}
					}
				});
			});

			it('should transform the properties using `onTransformProperties`', () => {
				expect(person.properties.birthday).toBeInstanceOf(Date);
				expect(person.properties).not.toHaveProperty('name');
			});
		});

		describe('With links, actions, and entities', () => {
			let actions: Siren.IAction[];
			let entities: Siren.ISubEntity[];
			let links: Siren.ILinkedEntity[];

			beforeEach(() => {
				actions = [];
				entities = [];
				links = [];

				person = new Person({
					actions,
					entities,
					links
				});
			});

			it('should save the actions as-is', () => {
				expect(person.actions).toBe(actions);
			});

			it('should save the entities as-is', () => {
				expect(person.entities).toBe(entities);
			});

			it('should save the links as-is', () => {
				expect(person.links).toBe(links);
			});
		});

		describe('With a self-link', () => {
			let selfLink: Siren.ILinkedEntity;

			beforeEach(() => {
				selfLink = generateSelfLink();

				person = new Person({
					links: [selfLink]
				});
			});

			it('should be accessible', () => {
				expect(person.selfLinkHref).toBe(selfLink.href);
			});
		});
	});
});

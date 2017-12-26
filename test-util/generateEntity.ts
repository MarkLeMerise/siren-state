import generateSelfLink from "./generateSelfLink";
import { kebabCase } from 'lodash';
import { ISirenModelConstructor } from "../src/registration/ISirenModelConstructor";
import { ISirenModel } from "../src/model/ISirenModel";

/**
 * Generates a sample Siren subentity POJO based on a concrete definition
 *
 * Useful for testing data flow
 */
export default function generateEntity(Type: ISirenModelConstructor<ISirenModel>, selfLinkHref?: string) {
	const sirenClass = Type.sirenClass || kebabCase(Type.name);

	const entity: Siren.ISubEntity = {
		class: [sirenClass],
		actions: [],
		entities: [],
		links: [generateSelfLink([sirenClass], selfLinkHref)],
		properties: {},
		rel: []
	};

	return entity;
}

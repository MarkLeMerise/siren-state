import { kebabCase } from 'lodash';
import { SirenModel } from '../src/siren-state-core/model/SirenModel';
import { ISirenModelConstructor } from '../src/siren-state-core/registration/ISirenModelConstructor';
import generateSelfLink from './generateSelfLink';

/**
 * Generates a sample Siren subentity POJO based on a concrete definition
 *
 * Useful for testing data flow
 */
export default function generateEntity<T extends SirenModel>(Type: ISirenModelConstructor<T>, selfLinkHref?: string) {
	const sirenClass = Type.sirenClass || kebabCase(Type.name);

	const entity: Siren.ISubEntity = {
		actions: [],
		class: [sirenClass],
		entities: [],
		links: [generateSelfLink([sirenClass], selfLinkHref)],
		properties: {},
		rel: []
	};

	return entity;
}

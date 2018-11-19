import { kebabCase } from 'lodash';
import { SirenModel } from '../siren-state-core/model/SirenModel';
import { ISirenModelConstructor } from '../siren-state-core/registration/ISirenModelConstructor';
import generateSelfLink from './generateSelfLink';

/**
 * Generates a mock Siren subentity based on a concrete type
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

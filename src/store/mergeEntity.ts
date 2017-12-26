import { flatMap, head, uniq } from 'lodash';
import { ISirenStateAtom } from '../ISirenStateAtom';
import { ISirenModel } from '../model/ISirenModel';
import { SirenModel } from '../model/SirenModel';
import { ISirenModelConstructor } from '../registration/ISirenModelConstructor';
import isLinkedEntity from '../siren-verify/isLinkedEntity';

function mergeSingleEntityTree(entity: Siren.IEntity, stateAtom: ISirenStateAtom, visited: Array<ISirenModelConstructor<ISirenModel>>) {
	const { store, registry } = stateAtom;

	// Linked entities must be distinguished from fully-loaded entities so we can't transform them
	(entity.entities || [])
		.filter(e => !isLinkedEntity(e))
		.forEach(e => mergeSingleEntityTree(e, stateAtom, visited));

	const ModelTypes = uniq((entity.class || [])
		.map(c => registry.getRegisteredModel(c))
		.filter(c => c),
	);

	if (ModelTypes.length > 1) {
		console.info('There are multiple registered types matching the incoming Siren classes. '
			+ 'The first matching type will be used.');
	}

	const DomainType = head(ModelTypes);

	if (DomainType) {
		store.storeModel(new DomainType(entity, stateAtom));
		visited.push(...registry.findDependents(DomainType)); // Deliberately mutate the array inline
	} else {
		store.storeModel(new SirenModel(entity, stateAtom));
		console.info('There is no matching domain model definition for this Siren response. '
		+ 'The entity will still be saved as a `SirenModel` and accessible by its self-link.', { class: entity.class });
	}
}

/**
 * Causes two stages of mutations: first, the incoming entities are merged into the `stateAtom` "inside-out".
 * That is, the most deeply nested subentities are merged first.
 * Second, any models who are dependent on the incoming entities are given a chance to make updates.
 *
 * For example, a collection model may want to refresh its references to its `item` subentities, which are found elswhere in the `stateAtom`.
 *
 * This operation immutably creates new entity models regardless of whether they already exist in the `stateAtom`.
 *
 * @param initialEntity The incoming entity
 * @param stateAtom The current global state
 */
export default function mergeEntity(initialEntity: Siren.IEntity, stateAtom: ISirenStateAtom) {
	const visitedTypes: Array<ISirenModelConstructor<ISirenModel>> = [];

	mergeSingleEntityTree(initialEntity, stateAtom, visitedTypes);

	flatMap(uniq(visitedTypes).map(Type => stateAtom.store.getModelByType(Type)))
		.map(model => model.onFromEntity(stateAtom))
		.forEach(model => stateAtom.store.storeModel(model));
};

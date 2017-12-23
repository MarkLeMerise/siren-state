import { ISirenStateAtom } from './ISirenStateAtom';
import isLinkedEntity from './isLinkedEntity';
import { ISirenModelConstructor } from './modelRegistrationFactory';
import { Siren } from './Siren';

/**
 * Merges an `entity` into the provided `stateAtom`.
 * Entities are merged "inside-out", so the most deeply nested subentities are merged first.
 *
 * @param entity
 * @param stateAtom
 */
export default function mergeEntity(entity: Siren.IEntity, stateAtom: ISirenStateAtom) {
    const { domain } = stateAtom;

    // Handle embedded entities before linked in case linked entities want to reference them
    (entity.entities || [])
        .filter((entity) => !isLinkedEntity(entity))
        .forEach((entity) => mergeEntity(entity, stateAtom));

    const ModelTypes = (entity.class || [])
        .map((c) => domain.getRegisteredModel(c))
        .reduce((set, Type) => {
            if (Type) {
                set.add(Type);
            }

            return set;
        }, new Set<ISirenModelConstructor>());

    if (ModelTypes.size > 1) {
        console.warn('There are multiple registered types matching the incoming Siren classes. The first matching type will be used.');
    }

    const DomainType = Array.from(ModelTypes)[0];

    if (DomainType) {
        domain.storeModel(new DomainType().fromEntity(entity, stateAtom));
    } else {
        console.warn('There is no matching domain model definition for this Siren response. Create a model to capture this entity in the store.');
    }
};
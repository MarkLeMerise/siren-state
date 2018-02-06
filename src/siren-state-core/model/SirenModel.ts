import { defaults } from 'lodash';
import { ISirenStateAtom } from '../state/ISirenStateAtom';
import getSelfLinkHref from '../util/getSelfLinkHref';
import { ISirenModel } from './ISirenModel';

/**
 * Base class for Siren-based domain models
 *
 * Though it can be used indepently, this class works best when extended with domain-specific information.
 *
 * @template V The allowable protocol methods for actions
 * @template S The signature of the incoming Siren properties
 * @template C The signature of the client-side properties object
 */
export class SirenModel<V = {}, S = {}, C = S> implements ISirenModel<V, S, C> {
	public actions: Array<Siren.IAction<V>>;
	public entities: Array<Siren.ISubEntity<V>>;
	public links: Siren.ILinkedEntity[];
	public properties: C;

	constructor(entity: Siren.IEntity<S>, stateAtom?: ISirenStateAtom) {
		return this.fromEntity(entity, stateAtom);
	}

	public get selfLinkHref() {
		return getSelfLinkHref(this);
	}

	public onDependencyChange(stateAtom: ISirenStateAtom) {
		return this;
	}

	/**
	 * Reconile a new entity state into an existing one.
	 * The `stateAtom` is passed in case the entity wishes to update any references to other entities.
	 *
	 * @param stateAtom Global state
	 * @param entity The new entity
	 */
	public fromEntity(entity: Siren.IEntity<S>, stateAtom?: ISirenStateAtom) {
		let newModel = this;
		const entityWithDefaults = defaults({}, entity, {
			actions: [],
			entities: [],
			links: [],
			properties: {}
		});

		if (stateAtom) {
			newModel = this.onDependencyChange(stateAtom);
		}

		Object.assign(newModel, entityWithDefaults);

		return newModel;
	}
}

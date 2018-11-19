import { defaults } from 'lodash';
import { ISirenStateAtom } from '../state/ISirenStateAtom';
import getSelfLinkHref from '../util/getSelfLinkHref';

/**
 * Base class for Siren-based domain models, exposing Siren primitives and allowing mutation
 *
 * Though it can be used directly, this class works best when extended with domain-specific information.
 * The properties of these models should not be mutated directly, but rather through forms.
 *
 * @template TProperties The signature of the incoming Siren properties
 * @template TMethods The allowable protocol methods for actions
 */
export class SirenModel<TProperties = {}, TMethods = {}> {
	protected entity: Siren.IEntity<TProperties, TMethods>;

	constructor(entity?: Siren.IEntity<TProperties>, stateAtom?: ISirenStateAtom) {
		return this.fromEntity(entity, stateAtom);
	}

	public get sirenEntity() {
		return this.entity;
	}

	public get actions() {
		return this.entity.actions;
	}

	public get entities() {
		return this.entity.entities;
	}

	public get links() {
		return this.entity.links;
	}

	public get properties() {
		return this.entity.properties;
	}

	public get selfLinkHref() {
		return getSelfLinkHref(this);
	}

	/**
	 * Subclasses SHOULD override this method to resolve references to other objects in the graph
	 *
	 * @param stateAtom The application state
	 */
	public onDependencyChange(stateAtom: ISirenStateAtom) {
		return this;
	}

	/**
	 * Reconile a new entity state into an existing one.
	 * The `stateAtom` is passed in case the entity wishes to update any references to other entities.
	 *
	 * Subclasses MAY override this method to perform customized reconciliation (e.g. property transforms)
	 *
	 * @param stateAtom The application state
	 * @param entity The new entity
	 */
	public fromEntity(entity: Siren.IEntity<TProperties> = {}, stateAtom?: ISirenStateAtom) {
		let newModel = this;
		const entityWithDefaults = defaults({}, entity, {
			actions: [],
			entities: [],
			links: [],
			properties: {}
		});

		this.entity = entityWithDefaults;

		if (stateAtom) {
			newModel = this.onDependencyChange(stateAtom);
		}

		return newModel;
	}
}

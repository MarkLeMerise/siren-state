import { ISirenStateAtom } from '../ISirenStateAtom';
import getSelfLinkHref from '../util/getSelfLinkHref';
import { ISirenModel } from './ISirenModel';

/**
 * Base class for Siren-based domain models
 *
 * Though it can be used indepently, this class works best when extended with domain-specific information.
 *
 * @template T The signature of the client-side properties
 * @template P The signature of the Siren properties object
 */
export class SirenModel<T = {}, P = T> implements ISirenModel<T> {
	public actions: Siren.IAction[] = [];
	public entities: Siren.ISubEntity[] = [];
	public links: Siren.ILinkedEntity[] = [];
	public properties: Partial<T> = {};

	constructor(entity?: Siren.IEntity<P>, stateAtom?: ISirenStateAtom) {
		if (entity) {
			return this.fromEntity(entity, stateAtom);
		}
	}

	public get selfLinkHref() {
		return getSelfLinkHref(this);
	}

	/**
	 * Lifecycle hook that MAY be overridden by subclasses to apply transforms to properties.
	 * For example, transforming a UTC date string into a JavaScript `Date` object.
	 *
	 * This method SHOULD be pure.
	 *
	 * @param incomingProps The updated properties
	 * @returns A new object containing the transformed props
	 */
	protected onTransformProperties(incomingProps: P): Partial<T> {
		return incomingProps as Partial<T>;
	}

	/**
	 * Lifecycle hook that MAY be overridden by subclasses to choose how entities are processed
	 * This method is called when new versions of this entity are merged and when its dependent models change.
	 *
	 * For example, this method could be used to create or update convenience properties for access to particular subentities.
	 *
	 * This method MAY cause side effects, but can safely return a new `SirenModel` to maintain immutability.
	 *
	 * @param stateAtom The current global state to query for anything in the model graph
	 * @returns A modified SirenModel
	 */
	public onFromEntity(stateAtom?: ISirenStateAtom): SirenModel<T, P> {
		return this;
	}

	/**
	 * Reconile a new entity state into an existing one.
	 *
	 * Protected access encourages immutability but does not enforce it.
	 *
	 * @param entity The updated entity
	 * @param stateAtom Optional global state to
	 */
	protected fromEntity(entity: Siren.IEntity<P>, stateAtom?: ISirenStateAtom) {
		this.properties = entity.properties ? Object.assign({}, this.onTransformProperties(entity.properties)) : {};
		this.links = entity.links || [];
		this.actions = entity.actions || [];
		this.entities = entity.entities || [];
		return this.onFromEntity(stateAtom);
	}
}

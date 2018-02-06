import { ISirenStateAtom } from '../state/ISirenStateAtom';

/**
 * Base interface for exposing Siren primitives and allowing mutation
 *
 * @template V The allowable protocol methods for actions
 * @template S The signature of the client-side properties
 * @template C The signature of the Siren properties object
 */
export interface ISirenModel<V = {}, S = {}, C = S> {
	readonly selfLinkHref?: string;
	readonly actions: Array<Siren.IAction<V>>;
	readonly entities: Array<Siren.ISubEntity<V>>;
	readonly properties: Partial<C>;
	readonly links: Siren.ILinkedEntity[];
	onDependencyChange(stateAtom?: ISirenStateAtom): this;
	fromEntity(entity: Siren.IEntity<S>, stateAtom?: ISirenStateAtom): this;
}

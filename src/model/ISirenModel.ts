import { ISirenStateAtom } from '../ISirenStateAtom';

export interface ISirenModel<T = {}> {
	readonly selfLinkHref?: string;
	readonly actions: Siren.IAction[];
	readonly entities: Siren.ISubEntity[];
	readonly properties: Partial<T>;
	readonly links: Siren.ILinkedEntity[];
	onFromEntity(stateAtom?: ISirenStateAtom): ISirenModel<T>;
}

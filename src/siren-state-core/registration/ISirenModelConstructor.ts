import { ISirenModel } from '../model/ISirenModel';
import { ISirenStateAtom } from '../state/ISirenStateAtom';

export interface ISirenModelConstructor<T extends ISirenModel> {
	sirenClass?: string;
	new(entity?: Siren.IEntity, stateAtom?: ISirenStateAtom): T;
}

import { ISirenStateAtom } from '../ISirenStateAtom';
import { ISirenModel } from '../model/ISirenModel';

export interface ISirenModelConstructor<T extends ISirenModel> {
	sirenClass?: string;
	new(entity?: Siren.IEntity, stateAtom?: ISirenStateAtom): T;
}

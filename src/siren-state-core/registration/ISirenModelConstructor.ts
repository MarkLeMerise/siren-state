import { SirenModel } from '../model/SirenModel';
import { ISirenStateAtom } from '../state/ISirenStateAtom';

export interface ISirenModelConstructor<T extends SirenModel> {
	sirenClass?: string;
	new(entity?: Siren.IEntity, stateAtom?: ISirenStateAtom): T;
}

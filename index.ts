import actionCreatorFactory, { IActionCreatorsFactory } from './src/actions/actionCreatorFactory';
import { ISirenStateAtom } from './src/ISirenStateAtom';
import modelRegistrationFactory, { ISirenModelRegistrar } from './src/registration/modelRegistrationFactory';
import { SirenModelRegistry } from './src/registration/SirenModelRegistry';
import EntityIndexer from './src/store/EntityIndexer';
import { SirenModelStore } from './src/store/SirenModelStore';

export interface ISirenState {
	actionCreator: IActionCreatorsFactory;
	SirenModel: ISirenModelRegistrar;
	state: ISirenStateAtom;
}

export function createSirenStateAtom(): ISirenStateAtom {
	return {
		bookkeeping: new EntityIndexer(),
		registry: new SirenModelRegistry(),
		store: new SirenModelStore(),
	};
}

export default (stateAtom: ISirenStateAtom = createSirenStateAtom()): ISirenState => ({
	SirenModel: modelRegistrationFactory(stateAtom),
	actionCreator: actionCreatorFactory(stateAtom),
	state: stateAtom
});

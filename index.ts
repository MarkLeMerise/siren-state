import actionCreatorFactory, { IActionCreatorsFactory } from "./src/actions/actionCreatorFactory";
import modelRegistrationFactory, { ISirenModelRegistrar } from "./src/registration/modelRegistrationFactory";
import { ISirenStateAtom } from "./src/ISirenStateAtom";
import EntityIndexer from "./src/store/EntityIndexer";
import { SirenModelRegistry } from "./src/registration/SirenModelRegistry";
import { SirenModelStore } from "./src/store/SirenModelStore";

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
	actionCreator: actionCreatorFactory(stateAtom),
	SirenModel: modelRegistrationFactory(stateAtom),
	state: stateAtom
});

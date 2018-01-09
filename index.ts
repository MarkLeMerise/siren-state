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

/**
 * Generates a "clean" Siren State atom
 *
 * @pure
 */
export function createSirenStateAtom(): ISirenStateAtom {
	return {
		bookkeeping: new EntityIndexer(),
		registry: new SirenModelRegistry(),
		store: new SirenModelStore(),
	};
}

/**
 * Generates a new Siren State API based on a default "clean" state
 *
 * Passing a pre-created state into the `stateAtom` parameter is useful for testing
 *
 * @pure
 */
export default function sirenState(stateAtom: ISirenStateAtom = createSirenStateAtom()): ISirenState {
	return {
		SirenModel: modelRegistrationFactory(stateAtom),
		actionCreator: actionCreatorFactory(stateAtom),
		state: stateAtom
	};
}

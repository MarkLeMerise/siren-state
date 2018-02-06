import actionCreatorFactory, { IActionCreatorsFactory } from './actions/actionCreatorFactory';
import modelRegistrationFactory, { ISirenModelRegistrar } from './registration/modelRegistrationFactory';
import { SirenModelRegistry } from './registration/SirenModelRegistry';
import EntityIndexer from './state/EntityIndexer';
import { ISirenStateAtom } from './state/ISirenStateAtom';
import { SirenModelStore } from './state/SirenModelStore';

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

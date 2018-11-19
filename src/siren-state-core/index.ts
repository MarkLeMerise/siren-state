import actionCreatorFactory from './actions/actionCreatorFactory';
import modelRegistrationFactory from './registration/modelRegistrationFactory';
import createSirenStateAtom from './state/createSirenStateAtom';
import { ISirenState } from './state/ISirenState';
import { ISirenStateAtom } from './state/ISirenStateAtom';

/**
 * Generates a new Siren State API based, defaulting to a "clean" state
 *
 * @pure
 */
export default function sirenState(stateAtom: ISirenStateAtom = createSirenStateAtom()): ISirenState {
	return {
		Sirenify: modelRegistrationFactory(stateAtom),
		actionCreator: actionCreatorFactory(stateAtom),
		state: stateAtom
	};
}

import { IActionCreatorsFactory } from '../actions/IActionCreatorFactory';
import { ISirenModelRegistrar } from '../registration/ISirenModelRegistrar';
import { ISirenStateAtom } from './ISirenStateAtom';

export interface ISirenState {
	/**
	 * Mechanisms to read and write application state
	 */
	actionCreator: IActionCreatorsFactory;

	/**
	 * Annotation for Siren-based domain models to be included in the object graph
	 */
	Sirenify: ISirenModelRegistrar;

	/**
	 * The application state
	 */
	state: ISirenStateAtom;
}

import { IFormSupplier } from './actionCreatorFactory';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

/**
 * Interface for executing Siren affordances, which are the mechanisms for reading/writing state
 */
export interface IActionCreators {
	/**
	 * Executes a Siren action affordance
	 */
	doAction<T extends ISirenFormFieldSet>(formSupplier: IFormSupplier<T>): void;

	/**
	 * Loads an entity through a Siren link affordance
	 */
	followLink(link: Siren.ILinkedEntity): void;
}

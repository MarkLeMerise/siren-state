import { IFormSupplier } from './actionCreatorFactory';
import { ISirenFormFieldSet } from './ISirenFormFieldSet';

/**
 * Interface for executing Siren affordances, which are the exposed mechanisms for reading/writing server state.
 */
export interface IActionCreators {
	/**
	 * Executes a Siren action affordance
	 */
	doAction(formSupplier: IFormSupplier): Promise<void>;

	/**
	 * Loads an entity through a Siren link affordance
	 */
	followLink(link: Siren.ILinkedEntity): Promise<void>;
}

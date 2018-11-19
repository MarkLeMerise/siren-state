import { IFormSupplier } from './IFormSupplier';

/**
 * Interface for executing Siren affordances, the mechanisms for reading & writing state
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

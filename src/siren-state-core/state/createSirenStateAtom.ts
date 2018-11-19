import { SirenModelRegistry } from '../registration/SirenModelRegistry';
import EntityIndexer from './EntityIndexer';
import { ISirenStateAtom } from './ISirenStateAtom';
import { SirenModelStore } from './SirenModelStore';

/**
 * Generates a "clean" Siren State atom, the core component responsible for maintaining application state
 *
 * @pure
 */
export default function createSirenStateAtom(): ISirenStateAtom {
	return {
		bookkeeping: new EntityIndexer(),
		registry: new SirenModelRegistry(),
		store: new SirenModelStore(),
	};
}

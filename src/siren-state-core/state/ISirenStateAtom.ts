import { SirenModelRegistry } from '../registration/SirenModelRegistry';
import EntityIndexer from './EntityIndexer';
import { SirenModelStore } from './SirenModelStore';

export interface ISirenStateAtom {
	bookkeeping: EntityIndexer;
	registry: SirenModelRegistry;
	store: SirenModelStore;
}

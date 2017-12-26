import { ISirenModelRegistry } from './registration/ISirenModelRegistry';
import { IEntityIndexer } from './store/EntityIndexer';
import { ISirenModelStore } from './store/ISirenModelStore';

export interface ISirenStateAtom {
	bookkeeping: IEntityIndexer;
	registry: ISirenModelRegistry;
	store: ISirenModelStore;
}

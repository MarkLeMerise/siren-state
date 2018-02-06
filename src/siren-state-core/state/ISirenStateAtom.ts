import { ISirenModelRegistry } from '../registration/ISirenModelRegistry';
import { IEntityIndexer } from './EntityIndexer';
import { ISirenModelStore } from './ISirenModelStore';

export interface ISirenStateAtom {
	bookkeeping: IEntityIndexer;
	registry: ISirenModelRegistry;
	store: ISirenModelStore;
}

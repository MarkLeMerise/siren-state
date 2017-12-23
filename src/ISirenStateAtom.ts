import { IEntityIndexer } from './entityIndexer';
import { ISirenModelRegistry } from './SirenModelRegistry';

export interface ISirenStateAtom {
    domain: ISirenModelRegistry;
    bookkeeping: IEntityIndexer;
}
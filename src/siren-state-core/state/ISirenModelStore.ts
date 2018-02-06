import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from '../registration/ISirenModelConstructor';
import { ISirenModelStore } from './ISirenModelStore';

export interface ISirenModelStore {
	getModelByHref<T extends ISirenModel>(href?: string): T | undefined;
	getModelByType<T extends ISirenModel>(Type: ISirenModelConstructor<T>): T[];
	storeModel<T extends ISirenModel>(model: T): void;
}

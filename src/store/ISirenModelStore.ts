import { ISirenFormFieldSet } from '../actions/ISirenFormFieldSet';
import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from '../registration/ISirenModelConstructor';
import { ISirenModelStore } from './ISirenModelStore';

export interface ISirenModelStore {
	getModelByHref(href?: string): ISirenModel | undefined;
	getModelByType<T extends ISirenModel>(Type: ISirenModelConstructor<T>): T[];
	storeModel(model: ISirenModel<ISirenFormFieldSet>): void;
}

import { ISirenFormFieldSet } from '../actions/ISirenFormFieldSet';
import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from '../registration/ISirenModelConstructor';
import { ISirenModelStore } from './ISirenModelStore';

interface IStoredModelMap {
	[selfLink: string]: ISirenModel;
}

export class SirenModelStore implements ISirenModelStore {
	private models: IStoredModelMap = {};

	public getModelByHref(href?: string) {
		return href ? this.models[href] : undefined;
	}

	public getModelByType<T extends ISirenModel>(Type: ISirenModelConstructor<T>) {
		return Object.values(this.models).filter(m => m instanceof Type) as T[];
	}

	public storeModel<T extends ISirenFormFieldSet>(model: ISirenModel<T>) {
		if (!model.selfLinkHref) {
			throw new Error('All entities must have a self-link to be stored in the Siren state atom.');
		}

		this.models[model.selfLinkHref] = model;
	}
}

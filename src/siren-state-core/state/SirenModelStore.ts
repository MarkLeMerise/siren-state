import { SirenModel } from '../model/SirenModel';
import { ISirenModelConstructor } from '../registration/ISirenModelConstructor';

interface IStoredModelMap {
	[selfLink: string]: SirenModel;
}

export class SirenModelStore {
	private models: IStoredModelMap = {};

	public getModelByHref<T extends SirenModel>(href?: string) {
		return href ? this.models[href] as T : undefined;
	}

	public getModelByType<T extends SirenModel>(Type: ISirenModelConstructor<T>) {
		return Object.values(this.models).filter(m => m instanceof Type) as T[];
	}

	public storeModel<T extends SirenModel>(model: T) {
		if (!model.selfLinkHref) {
			throw new Error('All entities must have a self-link to be stored in the Siren state atom.');
		}

		this.models[model.selfLinkHref] = model;
	}
}

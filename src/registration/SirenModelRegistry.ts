import { Graph } from 'graphlib';
import * as log from 'loglevel';
import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from './ISirenModelConstructor';
import { ISirenModelRegistry } from './ISirenModelRegistry';

interface IRegisteredModelMap {
	[sirenClass: string]: ISirenModelConstructor<ISirenModel>;
}

export class SirenModelRegistry implements ISirenModelRegistry {
	private registeredModels: IRegisteredModelMap = {};
	private modelGraph = new Graph({ multigraph: true });

	public createDependency(rel: string, Dependent: ISirenModelConstructor<ISirenModel>, Dependency: ISirenModelConstructor<ISirenModel>) {
		this.modelGraph.setEdge(Dependent.name, Dependency.name, rel);
	}

	public findDependents(Dependency: ISirenModelConstructor<ISirenModel>) {
		if (!this.hasModelRegistered(Dependency)) {
			log.info(`Registry is missing registration for model "${ Dependency.name }. `
				+ 'Please ensure you have added a @SirenModel annotation to this class.');
		}

		return (this.modelGraph.predecessors(Dependency.name) || [])
			.map(modelName => this.getModelByName(modelName))
			.filter(c => c) as Array<ISirenModelConstructor<ISirenModel>>;
	}

	public registerModel(sirenClass: string, Type: ISirenModelConstructor<ISirenModel>) {
		if (sirenClass in this.registeredModels) {
			throw new Error('Each registered SirenModel name must use a unique class name.');
		}

		this.registeredModels[sirenClass] = Type;
	}

	public getRegisteredModel<T extends ISirenModel>(sirenClass: string) {
		if (sirenClass in this.registeredModels) {
			return this.registeredModels[sirenClass] as ISirenModelConstructor<T>;
		}
	}

	public hasModelRegistered(Type: ISirenModelConstructor<ISirenModel>) {
		return Object.values(this.registeredModels).includes(Type);
	}

	public hasSirenClass(sirenClass: string) {
		return Object.keys(this.registeredModels).includes(sirenClass);
	}

	private getModelByName(name: string) {
		const model = Object.values(this.registeredModels).find(m => m.name === name);

		if (!model) {
			log.warn(`Registry is missing registration for model "${ name }. `
			+ 'Please ensure you have added a @SirenModel annotation to this class.');
		}

		return model;
	}
}

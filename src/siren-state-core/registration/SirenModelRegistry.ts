import { Graph } from 'graphlib';
import * as log from 'loglevel';
import { SirenModel } from '../model/SirenModel';
import { ISirenModelConstructor } from './ISirenModelConstructor';

interface IRegisteredModelMap {
	[sirenClass: string]: ISirenModelConstructor<SirenModel>;
}

export class SirenModelRegistry {
	private registeredModels: IRegisteredModelMap = {};
	private modelGraph = new Graph({ multigraph: true });

	public createDependency(rel: string, Dependent: ISirenModelConstructor<SirenModel>, Dependency: ISirenModelConstructor<SirenModel>) {
		this.modelGraph.setEdge(Dependent.name, Dependency.name, rel);
	}

	public findDependents(Dependency: ISirenModelConstructor<SirenModel>) {
		if (!this.hasModelRegistered(Dependency)) {
			log.info(`Registry is missing registration for model "${ Dependency.name }. `
				+ 'Please ensure you have added a @SirenModel annotation to this class.');
		}

		return (this.modelGraph.predecessors(Dependency.name) || [])
			.map(modelName => this.getModelByName(modelName))
			.filter(c => c) as Array<ISirenModelConstructor<SirenModel>>;
	}

	public registerModel(sirenClass: string, Type: ISirenModelConstructor<SirenModel>) {
		if (sirenClass in this.registeredModels) {
			throw new Error('Each registered SirenModel name must use a unique class name.');
		}

		this.registeredModels[sirenClass] = Type;
	}

	public getRegisteredModel<T extends SirenModel>(sirenClass: string) {
		if (sirenClass in this.registeredModels) {
			return this.registeredModels[sirenClass] as ISirenModelConstructor<T>;
		}
	}

	public hasModelRegistered(Type: ISirenModelConstructor<SirenModel>) {
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

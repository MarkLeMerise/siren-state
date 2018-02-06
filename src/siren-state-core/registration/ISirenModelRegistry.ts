import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from './ISirenModelConstructor';

export interface ISirenModelRegistry {
	createDependency(rel: string, Dependent: ISirenModelConstructor<ISirenModel>, Dependency: ISirenModelConstructor<ISirenModel>): void;
	findDependents(Dependency: ISirenModelConstructor<ISirenModel>): Array<ISirenModelConstructor<ISirenModel>>;
	getRegisteredModel<T extends ISirenModel>(sirenClass: string): ISirenModelConstructor<T> | undefined;
	hasModelRegistered(Type: ISirenModelConstructor<ISirenModel>): boolean;
	hasSirenClass(sirenClass: string): boolean;
	registerModel(sirenClass: string, Type: ISirenModelConstructor<ISirenModel>): void;
}

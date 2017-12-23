import { ISirenModelConstructor } from './modelRegistrationFactory';
import { ISirenModel } from './SirenModel';

interface IRegisteredModelMap {
    [sirenClass: string]: ISirenModelConstructor;
}

interface IStoredModelMap {
    [selfLink: string]: ISirenModel;
}

export interface ISirenModelRegistry {
    registerModel(sirenClass: string, Type: ISirenModelConstructor): void;
    hasModelRegistered(Type: ISirenModelConstructor): boolean;
    hasSirenClass(sirenClass: string): boolean;
    getModelByHref(href: string): ISirenModel | undefined;
    getRegisteredModel(sirenClass: string): ISirenModelConstructor | undefined;
    storeModel(model: ISirenModel): void;
}

export class SirenModelRegistry implements ISirenModelRegistry {
    private registeredModels: IRegisteredModelMap = {};
    private storedModels: IStoredModelMap = {};

    public registerModel(sirenClass: string, Type: ISirenModelConstructor) {
        if (sirenClass in this.registeredModels) {
            throw new Error('Each registered SirenModel name must use a unique class name.');
        }

        this.registeredModels[sirenClass] = Type;
    }

    public getRegisteredModel(sirenClass: string) {
        return this.registeredModels[sirenClass];
    }

    public getModelByHref(href: string) {
        return this.storedModels[href];
    }

    public storeModel(model: ISirenModel) {
        if (!model.selfLinkHref) {
            throw new Error('All entities must have a self-link to be stored in the Siren state atom.');
        }

        this.storedModels[model.selfLinkHref] = model;
    }

    public hasModelRegistered(Type: ISirenModelConstructor) {
        return Object.values(this.registeredModels).includes(Type);
    }

    public hasSirenClass(sirenClass: string) {
        return Object.keys(this.registeredModels).includes(sirenClass);
    }
}
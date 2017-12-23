import { kebabCase } from 'lodash';
import { ISirenStateAtom } from './ISirenStateAtom';
import { ISirenModel } from './SirenModel';

interface ISirenModelConfiguration {
    className?: string;
}

export interface ISirenModelConstructor extends Function {
    new(): ISirenModel;
}

export type ISirenModelRegistrar = (config?: ISirenModelConfiguration) => (Type: ISirenModelConstructor) => void;

export default (stateAtom: ISirenStateAtom): ISirenModelRegistrar =>
    (config: ISirenModelConfiguration = {}) => (Type: ISirenModelConstructor) => {
        const sirenClass = config.className || kebabCase(Type.name);

        // Add class to global registry
        stateAtom.domain.registerModel(sirenClass, Type);
};
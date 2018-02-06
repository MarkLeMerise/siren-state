import { kebabCase } from 'lodash';
import { ISirenStateAtom } from '../ISirenStateAtom';
import { ISirenModel } from '../model/ISirenModel';
import { ISirenModelConstructor } from './ISirenModelConstructor';

interface ISirenModelConfiguration {
	sirenClass?: string;
	subentities?: { [rel: string]: ISirenModelConstructor<ISirenModel> };
}

export type ISirenModelRegistrar = (config?: ISirenModelConfiguration) =>
	<T extends ISirenModel>(Type: ISirenModelConstructor<T>) => void;

export default (stateAtom: ISirenStateAtom): ISirenModelRegistrar =>
	(config: ISirenModelConfiguration = {}) =>
		<T extends ISirenModel>(Type: ISirenModelConstructor<T>) => {
			const { registry } = stateAtom;
			const sirenClass = config.sirenClass || kebabCase(Type.name);
			const subentities = config.subentities || {};

			stateAtom.registry.registerModel(sirenClass, Type);
			Type.sirenClass = sirenClass;

			Object.keys(subentities)
				.forEach(key => subentities[key] && registry.createDependency(key, Type, subentities[key]));
		};

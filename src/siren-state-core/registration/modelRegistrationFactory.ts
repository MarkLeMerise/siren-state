import { kebabCase } from 'lodash';
import { SirenModel } from '../model/SirenModel';
import { ISirenStateAtom } from '../state/ISirenStateAtom';
import { ISirenModelConfiguration } from './ISirenModelConfiguration';
import { ISirenModelConstructor } from './ISirenModelConstructor';
import { ISirenModelRegistrar } from './ISirenModelRegistrar';

export default (stateAtom: ISirenStateAtom): ISirenModelRegistrar => (config: ISirenModelConfiguration = {}) =>
	(Type: ISirenModelConstructor<SirenModel>) => {
		const { registry } = stateAtom;
		const sirenClass = config.sirenClass || kebabCase(Type.name);
		const subentities = config.subentities || {};

		stateAtom.registry.registerModel(sirenClass, Type);
		Type.sirenClass = sirenClass;

		Object.keys(subentities)
			.forEach(key => subentities[key] && registry.createDependency(key, Type, subentities[key]));
	};

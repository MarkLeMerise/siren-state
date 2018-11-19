import { SirenModel } from '../model/SirenModel';
import { ISirenModelConstructor } from './ISirenModelConstructor';

export interface ISirenModelConfiguration {
	sirenClass?: string;
	subentities?: { [rel: string]: ISirenModelConstructor<SirenModel> };
}

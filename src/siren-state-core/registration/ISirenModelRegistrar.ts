import { SirenModel } from '../model/SirenModel';
import { ISirenModelConfiguration } from './ISirenModelConfiguration';
import { ISirenModelConstructor } from './ISirenModelConstructor';

/**
 * Class annotation which registers a `SirenModel` in a Siren
 */
export type ISirenModelRegistrar = (config?: ISirenModelConfiguration) => (Type: ISirenModelConstructor<SirenModel>) => void;

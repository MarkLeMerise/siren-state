import { ISirenStateAtom } from '../state/ISirenStateAtom';
import SirenForm from './SirenForm';

export type IFormSupplier = SirenForm | ((stateAtom: ISirenStateAtom) => SirenForm);

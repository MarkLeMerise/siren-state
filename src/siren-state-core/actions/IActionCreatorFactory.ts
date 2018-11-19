import { IActionCreators } from './IActionCreators';
import { IActionInitiator } from './IActionInitiator';
import { IAffordanceLifecycle } from './IAffordanceLifecycle';

export type IActionCreatorsFactory = (actionInitiator: IActionInitiator, lifecycle: IAffordanceLifecycle) => IActionCreators;

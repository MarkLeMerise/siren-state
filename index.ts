import { SirenModelRegistry } from "./src/SirenModelRegistry";
import actionCreatorFactory from "./src/actionCreatorFactory";
import entityIndexer from "./src/entityIndexer";
import { ISirenStateAtom } from "./src/ISirenStateAtom";
import modelRegistrationFactory from "./src/modelRegistrationFactory";

export function createSirenStateAtom() {
    return {
        domain: new SirenModelRegistry(),
        bookkeeping: entityIndexer()
    };
}

export default (stateAtom: ISirenStateAtom = createSirenStateAtom()) => {
    return {
        actionCreator: actionCreatorFactory(stateAtom),
        SirenModel: modelRegistrationFactory(stateAtom)
    };
};
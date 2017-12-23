import { createSirenStateAtom } from '../../index';
import { ISirenStateAtom } from '../ISirenStateAtom';
import modelRegistrationFactory, { ISirenModelRegistrar } from '../modelRegistrationFactory';
import { SirenModel } from '../SirenModel';

describe('SirenModel', () => {
    let stateAtom: ISirenStateAtom;
    let SirenModelRegistrar: ISirenModelRegistrar;

    beforeEach(() => {
        stateAtom = createSirenStateAtom();
        SirenModelRegistrar = modelRegistrationFactory(stateAtom);
    });

    describe('Registering a SirenModel', () => {
        class FakeClass extends SirenModel<{}> {}

        beforeEach(() => {
            SirenModelRegistrar()(FakeClass);
        });

        it('should be in the registry', () => {
            expect(stateAtom.domain.hasModelRegistered(FakeClass)).toBeTruthy();
        });

        it('should have used the kebab-cased version of the model class', () => {
            expect(stateAtom.domain.hasSirenClass('fake-class')).toBeTruthy();
        });

        it('should throw an error when trying to register a SirenModel with the same name again', () => {
            expect(() => SirenModelRegistrar()(FakeClass)).toThrow();
        });
    });
});
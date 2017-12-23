import getSelfLinkHref from './getSelfLinkHref';
import { ISirenStateAtom } from './ISirenStateAtom';
import { Siren } from './Siren';

export interface ISirenModel<T extends object = {}> {
    readonly selfLinkHref?: string;
    readonly actions: Siren.IAction[];
    readonly entities: Siren.ISubEntity[];
    readonly properties: Partial<T>;
    readonly links: Siren.ILinkedEntity[];
    fromEntity(entity: Siren.IEntity<T>, state: ISirenStateAtom): ISirenModel<T>;
}

export class SirenModel<T extends object> implements ISirenModel<T> {
    public actions: Siren.IAction[] = [];
    public entities: Siren.ISubEntity[] = [];
    public links: Siren.ILinkedEntity[] = [];
    public properties: Partial<T> = {};

    public get selfLinkHref() {
        return getSelfLinkHref(this);
    }

    /**
     * Lifecycle hook that MAY be overridden by subclasses to apply transforms to properties.
     * For example, transforming a UTC date string into a JavaScript `Date` object.
     *
     * This method SHOULD be pure.
     *
     * @param incomingProps
     */
    public onTransformProperties(incomingProps: Partial<T> = {}) {
        return incomingProps;
    }

    /**
     * Lifecycle hook that MAY be overridden by subclasses to choose how entities are processed
     * For example, subclasses may want to create simple access properties for subentities
     *
     * This method is expected to cause side effects.
     *
     * @param entities
     */
    public onProcessSubentities(entities: Siren.ISubEntity[] = [], stateAtom: ISirenStateAtom) {
        return entities;
    }

    /**
     * Reconile a new entity state into an existing one
     *
     * @param entity
     * @param stateAtom
     */
    public fromEntity(entity: Siren.IEntity<T>, stateAtom: ISirenStateAtom) {
        const transformedProps = this.onTransformProperties(entity.properties);
        this.properties = Object.assign({}, this.properties, transformedProps);
        this.links = entity.links || [];
        this.actions = entity.actions || [];
        this.entities = entity.entities || [];

        this.onProcessSubentities(this.entities, stateAtom);

        return this;
    }
}
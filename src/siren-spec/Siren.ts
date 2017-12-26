/**
 * TypeScript implementation of the Siren hypermedia specification
 *
 * Decribed in [this document](https://github.com/kevinswiber/siren#actions-1)
 */
declare namespace Siren {

	/**
	 * Links represent navigational transitions.
	 * They may also appear as "embedded links" within the `subentities` array to communicate a relationship.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#links-1)
	 */
	interface ILinkedEntity {
		class?: string[];
		href: string;
		rel: string[];
		title?: string;
		type?: string;
	}

	type ISubEntity = ILinkedEntity | IEmbeddedEntity;

	/**
	 * Embedded sub-entity representations retain all the characteristics of a standard entity.
	 * But MUST also contain a `rel` attribute describing the relationship of the sub-entity to its parent.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#embedded-representation)
	 *
	 * @template P The signature of the "properties" object
	 */
	interface IEmbeddedEntity<P = {}> extends IEntity<P> {
		/**
		 * Defines the relationship of the sub-entity to its parent, per Web Linking (RFC5899). REQUIRED.
		 */
		rel: string[];
	}

	/**
	 * An Entity is a URI-addressable resource that has properties and actions associated with it.
	 * It may contain sub-entities and navigational links.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#entities)
	 *
	 * @template P The signature of the "properties" object
	 */
	interface IEntity<P = {}> {
		/**
		 * Describes the nature of an entity based on the current representation.
		 *
		 * Possible values are implementation-dependent and should be documented.
		 */
		class?: string[];

		/**
		 * Descriptive text about the entity.
		 */
		title?: string;

		/**
		 * A set of key-value pairs that describe the state of an entity.
		 */
		properties?: P;

		/**
		 * A collection of related sub-entities. If a sub-entity contains an `href` property,
		 * it should be treated as an embedded link. Clients may choose to optimistically load embedded links.
		 * If no `href` value exists, the sub-entity is an embedded entity representation that
		 * contains all the characteristics of a typical entity.
		 *
		 * However, a sub-entity MUST contain a `rel` property to describe its relationship to the parent entity.
		 */
		entities?: ISubEntity[];

		/**
		 * A collection of behaviors exposed by this entity
		 */
		actions?: IAction[];

		/**
		 * A collection of items that describe navigational links, distinct from entity relationships.
		 * Link items should contain a `rel` attribute to describe the relationship
		 * and an `href` attribute to point to the target URI.
		 *
		 * Entities SHOULD include a link `rel` to `self`.
		 */
		links?: ILinkedEntity[];
	}

	/**
	 * A behavior exposed by an entity
	 * The `fields` represent arguments for this action.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#actions-1)
	 */
	interface IAction {
		/**
		 * A string that identifies the action to be performed.
		 *
		 * Action names MUST be unique within the set of actions for an entity.
		 * The behaviour of clients when parsing a Siren document that violates this constraint is undefined.
		 */
		name: string;

		/**
		 * Describes the nature of an action based on the current representation.
		 *
		 * Possible values are implementation-dependent and should be documented.
		 */
		class?: string[];

		/**
		 * An enumerated attribute mapping to a protocol method.
		 *
		 * For HTTP, these values may be `GET`, `PUT`, `POST`, `DELETE`, or `PATCH`.
		 * As new methods are introduced, this list can be extended. If this attribute is omitted, `GET` should be assumed.
		 */
		method?: string;

		/**
		 * The URI of the action
		 */
		href: string;

		/**
		 * Descriptive text about the action.
		 */
		title?: string;

		/**
		 * The encoding type for the request. When omitted and the fields attribute exists.
		 *
		 * The default value is `application/x-www-form-urlencoded`.
		 */
		type?: string;

		/**
		 * The collection of fields
		 */
		fields?: IField[];
	}

	/**
	 * Fields represent controls inside of actions.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#fields-1)
	 */
	interface IField {
		/**
		 * Describes the nature of an action based on the current representation.
		 */
		class?: string[];

		/**
		 * A name describing the control.
		 *
		 * Field names MUST be unique within the set of fields for an action.
		 * The behaviour of clients when parsing a Siren document that violates this constraint is undefined.
		 */
		name: string;

		/**
		 * The input type of the field. This is a subset of the input types specified by HTML5.
		 */
		type?: 'hidden' | 'text' | 'search' | 'tel' | 'url' | 'email' | 'password' | 'datetime' |
				'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range' |
				'color' | 'checkbox' | 'radio' | 'file';

		/**
		 * Textual annotation of a field. Clients may use this as a label.
		 */
		title?: string;

		/**
		 * A value assigned to the field.  May be a scalar value or a list of value objects.
		 */
		value?: string | number | File | null;
	}
}

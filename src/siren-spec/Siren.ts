/**
 * TypeScript implementation of the Siren hypermedia specification
 *
 * Described in [this document](https://github.com/kevinswiber/siren#actions-1)
 */
declare namespace Siren {
	type ISubEntity<TProperties = {}, TMethods = {}> = ILinkedEntity | IEmbeddedEntity<TProperties, TMethods>;

	/**
	 * Linked entities may appear as
	 * 	1) [navigational transitions](https://github.com/kevinswiber/siren#links-1), or
	 * 	2) ["embedded links"](https://github.com/kevinswiber/siren#embedded-link) within the `subentities` array to communicate a relationship.
	 *
	 * In the current spec, their interface is identical.
	 */
	interface ILinkedEntity {
		/**
		 * Describes the nature of an entity's content based on the current representation.
		 * Possible values are implementation-dependent and should be documented.
		 * MUST be an array of strings. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#class-1)
		 */
		class?: string[];

		/**
		 * The URI of the linked sub-entity. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#href)
		 */
		href: string;

		/**
		 * Defines the relationship of the sub-entity to its parent, per Web Linking (RFC5988) and Link Relations.
		 * MUST be a non-empty array of strings. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#rel)
		 */
		rel: string[];

		/**
		 * Descriptive text about the entity.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#title-1)
		 */
		title?: string;

		/**
		 * Defines media type of the linked sub-entity, per [Web Linking (RFC5988)](http://tools.ietf.org/html/rfc5988). Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#type)
		 */
		type?: string;
	}

	/**
	 * Embedded sub-entity representations retain all the characteristics of a standard entity.
	 * But MUST also contain a `rel` attribute describing the relationship of the sub-entity to its parent.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#embedded-representation)
	 *
	 * @template TMethods The allowed methods for the protocol (e.g. GET, PUT, POST, etc. for HTTP)
	 * @template TProperties The signature of the "properties" object
	 */
	interface IEmbeddedEntity<TProperties = {}, TMethods = {}> extends IEntity<TProperties, TMethods> {
		/**
		 * Defines the relationship of the sub-entity to its parent,
		 * per [Web Linking (RFC5988)](http://tools.ietf.org/html/rfc5988)
		 * and [Link Relations](http://www.iana.org/assignments/link-relations/link-relations.xhtml).
		 * MUST be a non-empty array of strings. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#rel)
		 */
		rel: string[];
	}

	/**
	 * An Entity is a URI-addressable resource that has properties and actions associated with it.
	 * It may contain sub-entities and navigational links.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#entities)
	 *
	 * @template TMethods The allowed methods for the protocol (e.g. GET, PUT, POST, etc. for HTTP)
	 * @template TProperties The optional signature of the "properties" object
	 */
	interface IEntity<TProperties = {}, TMethods = {}> {
		/**
		 * Describes the nature of an entity based on the current representation.
		 * Possible values are implementation-dependent and should be documented. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#class)
		 */
		class?: string[];

		/**
		 * Descriptive text about the entity.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#title)
		 */
		title?: string;

		/**
		 * A set of key-value pairs that describe the state of an entity. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#properties)
		 */
		properties?: TProperties;

		/**
		 * A collection of related sub-entities. If a sub-entity contains an `href` property,
		 * it should be treated as an embedded link. Clients may choose to optimistically load embedded links.
		 * If no `href` value exists, the sub-entity is an embedded entity representation that
		 * contains all the characteristics of a typical entity.
		 *
		 * However, a sub-entity MUST contain a `rel` property to describe its relationship to the parent entity.
		 *
		 * In JSON Siren, this is represented as an array. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#entities-1)
		 */
		entities?: Array<ISubEntity<TMethods>>;

		/**
		 * A collection of action objects, represented in JSON Siren as an array such as `{ "actions": [{ ... }] }`. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#actions)
		 */
		actions?: Array<IAction<TMethods>>;

		/**
		 * A collection of items that describe navigational links, distinct from entity relationships.
		 * Link items should contain a `rel` attribute to describe the relationship
		 * and an `href` attribute to point to the target URI.
		 *
		 * Entities SHOULD include a link `rel` to `self`. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#links)
		 */
		links?: ILinkedEntity[];
	}

	/**
	 * A behavior exposed by an entity
	 * The `fields` represent arguments for this action.
	 *
	 * [See the specification](https://github.com/kevinswiber/siren#actions-1)
	 *
	 * @template TMethods The allowed methods for the protocol (e.g. GET, PUT, POST, etc. for HTTP)
	 */
	interface IAction<TMethods = {}> {
		/**
		 * A string that identifies the action to be performed.
		 * Action names MUST be unique within the set of actions for an entity.
		 * The behaviour of clients when parsing a Siren document that violates this constraint is undefined. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#name)
		 */
		name: string;

		/**
		 * Describes the nature of an action based on the current representation.
		 * Possible values are implementation-dependent and should be documented. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#name)
		 */
		class?: string[];

		/**
		 * An enumerated attribute mapping to a protocol method. Optional.
		 *
		 * For HTTP, these values may be `GET`, `PUT`, `POST`, `DELETE`, or `PATCH`.
		 * As new methods are introduced, this list can be extended. If this attribute is omitted, `GET` should be assumed.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#method)
		 */
		method?: TMethods;

		/**
		 * The URI of the action. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#href-2)
		 */
		href: string;

		/**
		 * Descriptive text about the action. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#title-3)
		 */
		title?: string;

		/**
		 * The encoding type for the request.
		 * When omitted and the `fields` attribute exists, the default value is `application/x-www-form-urlencoded`. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#type-2)
		 */
		type?: string;

		/**
		 * A collection of fields, expressed as an array of objects in JSON Siren as `{ "fields" : [{ ... }] }`. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#fields)
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
		 * Describes aspects of the field based on the current representation.
		 * Possible values are implementation-dependent and should be documented. MUST be an array of strings. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#class-4)
		 */
		class?: string[];

		/**
		 * A name describing the control.
		 *
		 * Field names MUST be unique within the set of fields for an action.
		 * The behaviour of clients when parsing a Siren document that violates this constraint is undefined. Required.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#name-1)
		 */
		name: string;

		/**
		 * The input type of the field. This is a subset of the input types specified by HTML5.
		 * When missing, the default value is `text`.
		 * Serialization of these fields will depend on the value of the action's `type` attribute. See type under Actions, above. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#type-3)
		 */
		type?: 'hidden' | 'text' | 'search' | 'tel' | 'url' | 'email' | 'password' | 'datetime' |
				'date' | 'month' | 'week' | 'time' | 'datetime-local' | 'number' | 'range' |
				'color' | 'checkbox' | 'radio' | 'file';

		/**
		 * Textual annotation of a field. Clients may use this as a label. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#title-4)
		 */
		title?: string;

		/**
		 * A value assigned to the field. Optional.
		 *
		 * [See the specification](https://github.com/kevinswiber/siren#value)
		 */
		value?: any;
	}
}

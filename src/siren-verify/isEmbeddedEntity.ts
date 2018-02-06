/**
 * Determines if an entity is embedded inside another entity
 * Embedded entities MUST have a "rel" property
 *
 * https://github.com/kevinswiber/siren#embedded-representation
 */
export default (entity: Siren.IEntity): entity is Siren.ISubEntity => 'rel' in entity;

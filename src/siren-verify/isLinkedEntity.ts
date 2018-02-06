/**
 * Determines if an entity is a linked representation, as opposed to an embedded representation
 * A linked entity MUST have an "href" attribute
 *
 * https://github.com/kevinswiber/siren#embedded-link
 */
export default (entity: Siren.ISubEntity): entity is Siren.ILinkedEntity => 'href' in entity;

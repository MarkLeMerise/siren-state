/**
 * Returns string "self-link" of an entity, which is its URI
 *
 * The URI for any particular entity can be considered a UUID of sorts in Siren.
 *
 * @param entity The entity
 */
export default function getSelfLinkHref(entity: Siren.IEntity) {
	return (entity.links || [])
		.filter(link => link.rel.includes('self'))
		.map(link => link.href)[0];
}

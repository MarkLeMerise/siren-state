export default (entity: Siren.IEntity): entity is Siren.ISubEntity => {
	return 'rel' in entity;
};

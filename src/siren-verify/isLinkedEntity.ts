export default (entity: Siren.ISubEntity): entity is Siren.ILinkedEntity => 'href' in entity;

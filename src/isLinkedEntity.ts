import { Siren } from './Siren';

export default (entity: Siren.ISubEntity): entity is Siren.ILinkedEntity => {
    return 'href' in entity;
};
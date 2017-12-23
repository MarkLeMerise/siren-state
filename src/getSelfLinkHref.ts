import { Siren } from './Siren';

export default (entity: Siren.IEntity) => (entity.links || [])
    .filter((entity) => (entity.rel || []).includes('self'))
    .map((link) => link.href)[0];
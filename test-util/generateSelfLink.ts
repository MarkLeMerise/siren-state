import * as Chance from 'chance';
import generateLink from './generateLink';

const chance = new Chance();

export default (sirenClass: string[] = [ chance.word() ], href = chance.url()): Siren.ILinkedEntity => generateLink(sirenClass, href, ['self']);

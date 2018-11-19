import * as Chance from 'chance';
import generateLink from './generateLink';

const chance = new Chance();

/**
 * Generates a mock Siren self-link with the minimal required fields and "self" `rel`
 */
export default (sirenClass: string[] = [ chance.word() ], href = chance.url()): Siren.ILinkedEntity => generateLink(sirenClass, href, ['self']);

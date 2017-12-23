export function isMethodInProtocol(verb?: string): verb is EHttpVerb {
    return verb ? verb in EHttpVerb : false;
}

export enum EHttpVerb {
    GET = 'GET',
    POST = 'POST',
}
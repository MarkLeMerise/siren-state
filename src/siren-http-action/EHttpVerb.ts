export function isHttpMethod(verb?: string): verb is EHttpVerb {
	return verb ? verb in EHttpVerb : false;
}

export enum EHttpVerb {
	DELETE = 'DELETE',
	GET = 'GET',
	PATCH = 'PATCH',
	POST = 'POST',
	PUT = 'PUT'
}

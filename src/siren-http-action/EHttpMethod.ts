export function isHttpMethod(verb?: string): verb is EHttpMethod {
	return verb ? verb in EHttpMethod : false;
}

export enum EHttpMethod {
	DELETE = 'DELETE',
	GET = 'GET',
	PATCH = 'PATCH',
	POST = 'POST',
	PUT = 'PUT'
}

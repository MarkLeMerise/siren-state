/**
 * Verifies the required fields of a Siren action against the Siren spec
 * Also serves as a convenient type guard for TypeScript consumers
 *
 * https://github.com/kevinswiber/siren#actions-1
 */
export default (action?: Siren.IAction): action is Siren.IAction => {
	let isSpecCompliant = false;

	if (action && action.name && action.href) {
		isSpecCompliant = true;
	}

	return isSpecCompliant;
};

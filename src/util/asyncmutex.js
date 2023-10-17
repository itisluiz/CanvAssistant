import CryptoJS from 'crypto-js';

const actionOwnership = new Map();

function actionIdentifierBuilder(...actionIdentifiers)
{
	return CryptoJS.MD5(actionIdentifiers.sort().join('')).toString();
}

export function setActionOwner(ownerIdentifier, ...actionIdentifiers)
{
	const actionIdenfifier = actionIdentifierBuilder(...actionIdentifiers);
	actionOwnership.set(actionIdenfifier, ownerIdentifier);
}

export function assertActionOwnership(ownerIdentifier, ...actionIdentifiers)
{
	const actionIdenfifier = actionIdentifierBuilder(...actionIdentifiers);

	if (!actionOwnership.has(actionIdenfifier) || actionOwnership.get(actionIdenfifier) === ownerIdentifier)
	{
		actionOwnership.delete(actionIdenfifier);
		return true;
	}

	return false;
}

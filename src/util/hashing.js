import CryptoJS from 'crypto-js';

export function recursiveObjectData(object, whitelist = null, blacklist = null, maxDepth = 8, maxFilterDepth = 1, depth = 0)
{
	const objectData = [];

	if (typeof object === 'object')
	{
		for (const key in object)
		{
			if (depth < maxFilterDepth && ((whitelist && !whitelist.includes(key)) || (blacklist && blacklist.includes(key))))
				continue;

			if (depth < maxDepth)
				objectData.push(...recursiveObjectData(object[key], whitelist, blacklist, maxDepth, maxFilterDepth, depth + 1));
		}
	}
	else
		objectData.push(object);

	return objectData;
}

export function dataHash(...data)
{
	return CryptoJS.MD5(data.sort().join('')).toString();
}

export function randomHash()
{
	const value = parseInt(Math.random() * Number.MAX_SAFE_INTEGER).toString();
	return CryptoJS.MD5(value).toString();
}

export function hashIdBuilder(identifier, ...data)
{
	return `${identifier}[${data.length > 0 ? dataHash(...data) : randomHash()}]`;
}

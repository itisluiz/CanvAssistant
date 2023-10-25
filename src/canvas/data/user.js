import NodeCache from 'node-cache';

const selfCache = new NodeCache({stdTTL: 900});
export async function getSelf(canvas, noCache = false)
{
	const cacheKey = canvas.uniqueUserId;

	if (!selfCache.has(cacheKey) || noCache)
	{
		const userRequest = await canvas.get('users/self');
		selfCache.set(cacheKey, userRequest.body);
	}

	return selfCache.get(cacheKey);
}

import NodeCache from 'node-cache';

const brandingCache = new NodeCache({stdTTL: 3600});
export async function getBranding(canvas, noCache = false)
{
	const cacheKey = canvas.uniqueRealmId;

	if (!brandingCache.has(cacheKey) || noCache)
	{
		const brandingRequest = await canvas.get('brand_variables');
        const branding = brandingRequest.body;

        for (const brandingKey in branding)
        {
            const brandingValue = branding[brandingKey];

            if (brandingValue.startsWith('/'))
                branding[brandingKey] = canvas.gotClient.defaults.options.url.origin + brandingValue;
        }

		brandingCache.set(cacheKey, branding);
	}

	return brandingCache.get(cacheKey);
}

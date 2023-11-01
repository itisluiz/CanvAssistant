import { dataHash } from '../../util/hashing.js';
import NodeCache from 'node-cache';

const announcementCache = new NodeCache({stdTTL: 900});
export async function getAnnouncements(canvas, courseId, noCache = false)
{
	const cacheKey = dataHash(canvas.uniqueRealmId, courseId);

	if (!announcementCache.has(cacheKey) || noCache)
	{
		const announcementsIterator = await canvas.listItems('announcements', {'context_codes': [`course_${courseId}`], 'start_date': '1970-01-01', 'end_date': '2038-01-19'});
		const announcements = [];
		for await (const announcement of announcementsIterator)
		{
			announcement.posted_at_timestamp = Math.floor(new Date(announcement.posted_at).getTime() / 1000);
			announcements.push(announcement);
		}

		announcementCache.set(cacheKey, announcements);
	}

	return announcementCache.get(cacheKey);
}

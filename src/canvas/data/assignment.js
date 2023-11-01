import { dataHash } from '../../util/hashing.js';
import NodeCache from 'node-cache';

const assignmentCache = new NodeCache({stdTTL: 900});
export async function getAssignments(canvas, courseId, noCache = false)
{
	const cacheKey = dataHash(canvas.uniqueRealmId, courseId);

	if (!assignmentCache.has(cacheKey) || noCache)
	{
		const assignmentsIterator = await canvas.listItems(`courses/${courseId}/assignments`, {'include': ['submission', 'score_statistics']});
		const assignments = [];
		for await (const assignment of assignmentsIterator)
		{
			assignment.created_at_timestamp = Math.floor(new Date(assignment.created_at).getTime() / 1000);
			assignment.updated_at_timestamp = Math.floor(new Date(assignment.updated_at).getTime() / 1000);
			assignment.due_at_timestamp = Math.floor(new Date(assignment.due_at).getTime() / 1000);
			assignments.push(assignment);
		}

		assignmentCache.set(cacheKey, assignments);
	}

	return assignmentCache.get(cacheKey);
}

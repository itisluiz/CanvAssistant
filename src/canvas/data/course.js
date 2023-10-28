import NodeCache from 'node-cache';

const courseCache = new NodeCache({stdTTL: 900});
export async function getSelfCourses(canvas, noCache = false)
{
	const cacheKey = canvas.uniqueUserId;

	if (!courseCache.has(cacheKey) || noCache)
	{
		const coursesIterator = await canvas.listItems('courses', {'enrollment_state': 'active', 'include': ['teachers', 'total_students', 'public_description']});
		const courses = [];
		for await (const course of coursesIterator)
		{
			if (course.enrollment_term_id === 1)
				continue;

			course.unbloated_name = unbloatCourseName(course.name);
			course.teacher_names = course.teachers.map(teacher => teacher.display_name);
			courses.push(course);
		}

		courseCache.set(cacheKey, courses);
	}

	return courseCache.get(cacheKey);
}

function unbloatCourseName(name)
{
	const delimiterCharacters = ['(', '-', '/', '_', '{', ';', '<', '@', '|'];
	const index = Math.min(...delimiterCharacters.map(char => name.indexOf(char)).filter(index => index !== -1));

	return (index !== -1) ? name.substring(0, index).trim() : name;
}

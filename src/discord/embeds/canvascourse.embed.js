import { EmbedBuilder } from 'discord.js';
import { getBranding } from '../../canvas/data/realm.js';
import { getSelfCourses } from '../../canvas/data/course.js';

export default async function build(interaction, canvas)
{
	const [branding, courses] = await Promise.all([getBranding(canvas), getSelfCourses(canvas)]);
	const course = courses.find(course => course.uuid === interaction.options.get('coursename').value);

	return new EmbedBuilder()
		.setColor(0xE72429)
		.setTitle(course.friendly_name)
		.setDescription(course.public_description || course.name)
		.setURL(`${canvas.gotClient.defaults.options.url.origin}/courses/${course.id}`)
		.setThumbnail('https://i.imgur.com/s67FJV5.png')
		.setAuthor({name: `${interaction.memberUser.displayName}'s enrolled in this course`, iconURL: interaction.memberUser.displayAvatarURL()})
		.setFooter({text: `Fetched from ${canvas.gotClient.defaults.options.url.hostname}`, iconURL: branding['ic-brand-msapplication-tile-square']})
		.addFields(
			{name: 'Teacher(s)', value: course.teacher_names.join(', ')},
			{name: 'Your scores', value: `**Current:** ${course.student_enrollment.computed_current_score || '*Not available*'}\n**Final:** ${course.student_enrollment.computed_final_score || '*Not available*'}` },
			{name: 'Students', value: course.total_students.toString()}
		);
}

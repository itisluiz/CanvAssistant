import { EmbedBuilder } from 'discord.js';
import { getBranding } from '../../canvas/data/realm.js';
import { getAnnouncements } from '../../canvas/data/announcement.js';
import { getSelfCourses } from '../../canvas/data/course.js';

export default async function build(interaction, canvas)
{
	const [branding, courses, announcements] = await Promise.all([getBranding(canvas), getSelfCourses(canvas), getAnnouncements(canvas, interaction.metadata)]);
	const course = courses.find(course => course.id.toString() === interaction.metadata);

	return new EmbedBuilder()
		.setColor(0xE72429)
		.setTitle(`Announcements for ${course.friendly_name}`)
		.setDescription(announcements.length > 0 ? 'Listing up to 25 announcements for this course' : 'This course has had no announcements!')
		.setURL(`${canvas.gotClient.defaults.options.url.origin}/courses/${course.id}/announcements`)
		.setThumbnail('https://i.imgur.com/TzC70oR.png')
		.setFooter({text: `Fetched from ${canvas.gotClient.defaults.options.url.hostname}`, iconURL: branding['ic-brand-msapplication-tile-square']})
		.setFields(announcements.splice(0, 25).map(announcement => { return {name: `📢  ${announcement.title}`, value: `**Author**: ${announcement.author.display_name}\n**Date**: <t:${announcement.posted_at_timestamp}:R>\n[View in Canvas](${announcement.url})`} }));
}

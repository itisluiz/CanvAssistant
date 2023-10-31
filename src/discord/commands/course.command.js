import { SlashCommandBuilder } from 'discord.js';
import { getCanvas } from '../../canvas/connection.js';
import { getSequelize } from '../../database/connection.js';
import { fallbackReply } from '../fallback.js';
import { getSelfCourses } from '../../canvas/data/course.js';
import { filterAndRespondAutocomplete } from '../autocomplete.js';
import { assertButtonOwnership } from '../buttons.js';
import canvascourseEmbed from '../embeds/canvascourse.embed.js';
import canvascourseComponent from '../components/canvascourse.component.js';

export const command = new SlashCommandBuilder()
	.setName('course')
	.setDescription('Canvas LMS courses')
	.addSubcommand(subcommand => subcommand
		.setName('view')
		.setDescription('View one of your active Canvas LMS courses')
		.addStringOption(option => option
			.setName('coursename')
			.setDescription('The name of the course to view')
			.setRequired(true)
			.setAutocomplete(true)
		)
	);

export async function course_view(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id, {include: [{ model: models.Realm, as: 'Realm' }]});

	if (!userEntry || !userEntry.canvasToken)
	{
		await interaction.reply({content: '`❗` You must setup your Canvas LMS account before you can view it!', ephemeral: true});
		return;
	}
	
	await interaction.deferReply();
	const { canvas } = await getCanvas(userEntry.Realm.url, userEntry.canvasToken, false);

	await interaction.followUp({embeds: [await canvascourseEmbed(interaction, canvas)], components: [...await canvascourseComponent(interaction, canvas)] });
}

export async function course_view_autocomplete_coursename(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id, {include: [{ model: models.Realm, as: 'Realm' }]});

	if (!userEntry || !userEntry.canvasToken)
		return;
	
	const { canvas } = await getCanvas(userEntry.Realm.url, userEntry.canvasToken, false);

	const courses = await getSelfCourses(canvas);
	const courseOptions = courses.map(course => {return {name: course.friendly_name, value: course.id.toString()}});

	await filterAndRespondAutocomplete(interaction, courseOptions);
}

export async function course_announcements_button(interaction)
{	
	if (!await assertButtonOwnership(interaction))
		return;

	interaction.reply('TODO: Announcements!');
}

export async function protectedCommandInteraction(interaction, callback)
{
	try { await callback(interaction); }
	catch (ex)
	{
		if (interaction.isAutocomplete())
			return;

		switch (ex.name)
		{
			case 'RequestError':
				await fallbackReply(interaction, '`❌` Connection failed, could be due to a bad URL or connectivity issues.');
				break;

			case 'CanvasApiError':
				if (ex.code === 401)
					await fallbackReply(interaction, '`🔐` Authorization failed, this is likely to be caused by a bad token.');
				else
					throw ex;
				break;
			
			default:
				throw ex;
		}
	}
}

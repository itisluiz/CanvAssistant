import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { b64IdBuilder } from '../../util/hashing.js';

export default async function build(interaction)
{
	const courseId = interaction.options.get('coursename').value;

	return [new ActionRowBuilder()
		.addComponents(new ButtonBuilder()
			.setCustomId(b64IdBuilder('course:announcements', courseId))
			.setEmoji('📢')
			.setLabel('Announcements')
			.setStyle(ButtonStyle.Secondary)
		)
	];
}

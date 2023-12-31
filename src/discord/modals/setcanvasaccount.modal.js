import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default function build()
{
	return new ModalBuilder()
		.setCustomId('setcanvasaccount')
		.setTitle('Set Canvas LMS Account')
		.addComponents(
			new ActionRowBuilder()
				.addComponents(
					new TextInputBuilder()
						.setCustomId('realm')
						.setLabel('Canvas realm API URL')
						.setPlaceholder('https://myrealm.instructure.com/')
						.setMaxLength(512)
						.setStyle(TextInputStyle.Short)
				),
			new ActionRowBuilder()
				.addComponents(
					new TextInputBuilder()
						.setCustomId('token')
						.setLabel('Canvas API token')
						.setMaxLength(70)
						.setStyle(TextInputStyle.Short)
				)
		);
}

import { Events } from 'discord.js';

export const event = Events.InteractionCreate;

export async function execute(interaction)
{
	if (interaction.isChatInputCommand())
	{
		const command = interaction.client.commands[interaction.commandName];

		if (command)
			await command.execute(interaction);
	}
}

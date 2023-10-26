import { Events } from 'discord.js';
import { qualifiedCommandName } from '../commands.js';

export const event = Events.InteractionCreate;

export async function execute(interaction)
{
	const commandModule = interaction.client.commands[interaction.commandName];

	if (commandModule)
	{
		const qualifiedCommand = qualifiedCommandName(interaction);
		await commandModule.protectedCommandInteraction(interaction, commandModule[qualifiedCommand]);
	}
}

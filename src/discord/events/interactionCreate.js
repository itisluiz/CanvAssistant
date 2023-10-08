import { Events } from "discord.js";

export const event = Events.InteractionCreate;

export async function execute(interaction)
{
	const command = interaction.isChatInputCommand() ? interaction.client.commands[interaction.commandName] : null;

	if (command)
		command.execute(interaction);
}

import { Events } from 'discord.js';
import { qualifiedCommandName } from '../commands.js';
import { b64IdInterpreter } from '../../util/hashing.js';

export const event = Events.InteractionCreate;

export async function execute(interaction)
{
	if (interaction.isChatInputCommand() || interaction.isAutocomplete())
	{
		interaction.targetModule = interaction.commandName;
		interaction.subAction = interaction.options.getSubcommandGroup();
		interaction.action = interaction.options.getSubcommand();
	}
	else if (interaction.isButton())
	{
		const { identifier, data } = b64IdInterpreter(interaction.customId);
		const [ targetModule, action ] = identifier.split(':', 2);

		interaction.targetModule = targetModule;
		interaction.action = action;
		interaction.metadata = data;
	}

	if (interaction.targetModule)
	{
		const commandModule = interaction.client.commands[interaction.targetModule];
		await commandModule.protectedCommandInteraction(interaction, commandModule[qualifiedCommandName(interaction)]);
	}
}

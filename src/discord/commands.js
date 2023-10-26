import { importDirectory } from '../util/importing.js';
import { dataHash, hashChanged } from '../util/hashing.js';
import { logInfo } from '../util/logging.js';

export function qualifiedCommandName(interaction)
{
	const qualifiedCommand = [];
	
	qualifiedCommand.push(interaction.commandName);
	qualifiedCommand.push(interaction.options.getSubcommandGroup());
	qualifiedCommand.push(interaction.options.getSubcommand());

	if (interaction.isAutocomplete())
		qualifiedCommand.push('autocomplete', interaction.options.getFocused(true).name);

	return qualifiedCommand.filter(qualifier => qualifier).join('_');
}

export async function loadCommands(client)
{
	const commandModules = await importDirectory('./src/discord/commands', '.command.js');
	if (await hashChanged('./src/discord/commands/commands.eph.md5', dataHash(...commandModules.map(commandModule => JSON.stringify(commandModule.command)))))
	{
		logInfo('discord', 'Command hashes changed, updating all commands');
		await client.application.commands.set(commandModules.map(commandModule => commandModule.command));
	}
	
	logInfo('discord', `Loading ${commandModules.length} command(s)`);
	return commandModules.reduce((acc, commandModule) => {
		acc[commandModule.command.name] = commandModule
		return acc;
	}, {});
}

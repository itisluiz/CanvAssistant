import { checkUpdateHash, hashModules, importDirectory } from "../util/importing.js";
import { logInfo } from "../util/logging.js";

export async function loadCommands(client)
{
	const commandModules = await importDirectory('./src/discord/commands', '.command.js');
	const updatedHash = await checkUpdateHash('./src/discord/commands/commands.md5', hashModules(commandModules, ['command'], true));

	if (!updatedHash)
	{
		logInfo('discord', 'Command hashes changed, updating all commands');
		await client.application.commands.set(commandModules.map(commandModule => commandModule.command));
	}
	
	logInfo('discord', `Loaded ${commandModules.length} command(s)`);
	return commandModules.reduce((acc, commandModule) => {
		acc[commandModule.command.name] = commandModule
		return acc;
	}, {});
}

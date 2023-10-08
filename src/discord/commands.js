import { checkUpdateHash, hashModules, importDirectory } from "../util/importing.js";
import { logDebug, logInfo } from "../util/logging.js";

export async function loadCommands(client)
{
	const commandModules = await importDirectory('./src/discord/commands');
	const updatedHash = await checkUpdateHash('./src/discord/commands.md5', hashModules(commandModules));

	if (updatedHash)
		logDebug('discord', 'Command hashes up to date');
	else
	{
		logDebug('discord', 'Command hashes changed, updating all commands');
		await client.application.commands.set(commandModules.map(commandModule => commandModule.command));
	}
	
	logInfo('discord', `Loaded ${commandModules.length} command(s)`);
	return commandModules.reduce((acc, commandModule) => {
		acc[commandModule.command.name] = commandModule
		return acc;
	}, {});
}

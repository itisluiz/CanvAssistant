import { importDirectory } from '../util/importing.js';
import { dataHash, hashChanged } from '../util/hashing.js';
import { logInfo } from '../util/logging.js';

export async function loadCommands(client)
{
	const commandModules = await importDirectory('./src/discord/commands', '.command.js');
	if (await hashChanged('./src/discord/commands/commands.eph.md5', dataHash(...commandModules.map(commandModule => JSON.stringify(commandModule.command)))))
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

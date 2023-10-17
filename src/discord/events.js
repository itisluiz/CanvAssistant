import { importDirectory } from '../util/importing.js';
import { logInfo } from '../util/logging.js';

export async function registerEvents(client)
{
	const eventModules = await importDirectory('./src/discord/events', '.event.js');
	logInfo('discord', `Registered ${eventModules.length} event(s)`);

	for (const eventModule of eventModules)
		client.on(eventModule.event, eventModule.execute);
}

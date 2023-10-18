import { importDirectory } from '../util/importing.js';
import { logError, logInfo } from '../util/logging.js';
import { fallbackReply } from './reply.js';

async function safeEventExecute(eventModule, interaction)
{
	try { await eventModule.execute(interaction); }
	catch (ex)
	{
		fallbackReply(interaction);
		logError('discord', `Error throw at event "${eventModule.event}": (${ex.name || 'UnnamedException'}) ${ex.message || 'No message provided'}`);
	}
}

export async function registerEvents(client)
{
	const eventModules = await importDirectory('./src/discord/events', '.event.js');
	logInfo('discord', `Registered ${eventModules.length} event(s)`);

	for (const eventModule of eventModules)
		client.on(eventModule.event, (interaction) => safeEventExecute(eventModule, interaction));
}

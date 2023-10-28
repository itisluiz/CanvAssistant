import { protectedDiscordInteraction } from './fallback.js';
import { importDirectory } from '../util/importing.js';
import { logInfo } from '../util/logging.js';

export async function registerEvents(client)
{
	const eventModules = await importDirectory('./src/discord/events', '.event.js');
	logInfo('discord', `Registered ${eventModules.length} event(s)`);

	for (const eventModule of eventModules)
		client.on(eventModule.event, (interaction) => protectedDiscordInteraction(prepareInteraction(interaction), eventModule.execute));
}

function prepareInteraction(interaction)
{
	interaction.memberUser = interaction.member ?? interaction.user;
	return interaction;
}

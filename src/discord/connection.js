import { Client, GatewayIntentBits, Events } from 'discord.js';
import { loadCommands } from './commands.js';
import { registerEvents } from './events.js';
import { logInfo } from '../util/logging.js';

let client = null;

export async function closeDiscordClient()
{
	if (client)
		await client.destroy();

	client = null;
}

export async function getDiscordClient(forceNew = false)
{
	if (!client || forceNew)
	{
		if (client)
			await closeDiscordClient();

		client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers
			]
		});

		const clientReady = new Promise(resolve => client.once(Events.ClientReady, resolve));
		
		await registerEvents(client);
		await client.login(process.env.DC_TOKEN);
		await clientReady;
		logInfo('discord', `Client online as "${client.user.displayName}"`);
		client.commands = await loadCommands(client);
	}
	
	return client;
}

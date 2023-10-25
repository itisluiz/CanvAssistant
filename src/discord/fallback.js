import { logDebug, logError } from '../util/logging.js';

export async function protectedDiscordInteraction(eventModule, interaction)
{
	try { await eventModule.execute(interaction); }
	catch (ex)
	{
		if (interaction.isChatInputCommand())
			await fallbackReply(interaction, '`⚠️` Something went unexpectedly wrong!');
		
		logError('discord', `${ex.name ?? 'Unnamed exception'} caught by protected interaction: ${ex.message ?? 'No message provided'}`);
		logDebug('discord', 'Stack trace:', ex.stack);
	}
}

export async function fallbackReply(interaction, message)
{
	try
	{
		if (!interaction.deferred && !interaction.replied)
		{
			await interaction.reply({content: message, ephemeral: true})
			return true;
		}
	
		await interaction.followUp(message);
		return true;
	}
	catch
	{
		try
		{
			await interaction.channel.send(`${interaction.user} ${message}`);
			return true;
		}
		catch
		{
			logError('discord', `Failed to send fallback reply: "${message}"`);
			return false;
		}
	}
}

import { logError } from '../util/logging.js';

export async function persistentReply(interaction, message)
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
			logError('discord', `Ultimately failed to send persistent message: "${message}"`);
			return false;
		}
	}
}

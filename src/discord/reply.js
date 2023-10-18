import { logError } from '../util/logging.js';

export const replies = {
	nocanvas: '`❌` No Canvas LMS account setup for your Discord account.',
	badtoken: '`❌` Authorization failed, likely to be caused by a bad token.',
	badconnection: '`❌` Connection failed, could be due to a bad URL or connectivity issues.',
	unexpected: '`❌` An unexpected error ocurred.'
};

export async function fallbackReply(interaction, message = replies.unexpected)
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
			logError('discord', `Ultimately failed to send fallback reply: "${message}"`);
			return false;
		}
	}
}

export async function assertButtonOwnership(interaction)
{
	if (interaction.message.interaction && interaction.user.id !== interaction.message.interaction.user.id)
	{
		await interaction.reply({content: '`🔒` Only the command issuer may interact with this button!', ephemeral: true});
		return false;
	}

	return true;
}

export async function filterAndRespondAutocomplete(interaction, options)
{
	const query = interaction.options.getFocused().toLowerCase();
	const filteredOptions = options.filter(entry => entry.name.toLowerCase().includes(query));

	await interaction.respond(filteredOptions.splice(0, 24));
}

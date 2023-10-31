export async function filterAndRespondAutocomplete(interaction, options)
{
	const query = interaction.options.getFocused().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
	const filteredOptions = options.filter(entry => entry.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query));

	await interaction.respond(filteredOptions.splice(0, 25));
}

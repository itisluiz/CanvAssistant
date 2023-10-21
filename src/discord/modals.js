import { hashIdBuilder } from '../util/hashing.js';

export async function showAndAwaitModal(interaction, modal, timeout = 60000)
{
	modal.setCustomId(hashIdBuilder(modal.data.custom_id));
	await interaction.showModal(modal);
	
	try { return await interaction.awaitModalSubmit({filter: (modalInteraction) => modalInteraction.customId === modal.data.custom_id, time: timeout}); }
	catch { return null; };
}

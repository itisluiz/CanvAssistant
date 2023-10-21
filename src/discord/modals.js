import { ModalBuilder } from 'discord.js';
import { hashIdBuilder } from '../util/hashing.js';

export async function showAndAwaitModal(interaction, modal, timeout = 60000)
{
	const uniqueModal = ModalBuilder.from(modal)
		.setCustomId(hashIdBuilder(modal.data.custom_id));

	await interaction.showModal(uniqueModal);
	try { return await interaction.awaitModalSubmit({filter: (modalInteraction) => modalInteraction.customId === uniqueModal.data.custom_id, time: timeout}); }
	catch { return null; };
}

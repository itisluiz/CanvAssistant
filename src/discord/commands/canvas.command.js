import { SlashCommandBuilder } from "discord.js";
import setcanvasaccountModal from "../modals/setcanvasaccount.modal.js";
import normalizeUrl from "normalize-url";

export const command = new SlashCommandBuilder()
	.setName('canvas')
	.setDescription('Canvas LMS account configuration')
	.addSubcommand(subcommand => subcommand
		.setName('setaccount')
		.setDescription('Setup your Canvas LMS account')
	)
	.addSubcommand(subcommand => subcommand
		.setName('removeaccount')
		.setDescription('Remove your Canvas LMS account')
	)

export async function execute(interaction)
{
	switch (interaction.options.getSubcommand())
	{
		case 'setaccount':
			interaction.showModal(setcanvasaccountModal);

			let modalInteraction = null;
			try { modalInteraction = await interaction.awaitModalSubmit({time: 60000}); }
			catch { break; };

			const realm = normalizeUrl(modalInteraction.fields.getTextInputValue('realm'));
			const token = modalInteraction.fields.getTextInputValue('token').trim();
			// TODO: Link account

			break;
		case 'removeaccount':
			// TODO: Unlink account

			break;
	}
	
}

import { SlashCommandBuilder } from 'discord.js';
import { getCanvas } from '../../canvas/connection.js';
import { getSequelize } from '../../database/connection.js';
import { fallbackReply } from '../fallback.js';
import { showAndAwaitModal } from '../modals.js';
import canvasprofileEmbed from '../embeds/canvasprofile.embed.js';
import setcanvasaccountModal from '../modals/setcanvasaccount.modal.js';

export const command = new SlashCommandBuilder()
	.setName('account')
	.setDescription('Canvas LMS account configuration')
	.addSubcommand(subcommand => subcommand
		.setName('view')
		.setDescription('Show details about the currently linked Canvas LMS account')
	)
	.addSubcommand(subcommand => subcommand
		.setName('setup')
		.setDescription('Setup a new Canvas LMS account to be linked with your Discord account')
	)
	.addSubcommand(subcommand => subcommand
		.setName('remove')
		.setDescription('Remove the currently linked Canvas LMS account from your Discord account')
	);

export async function account_view(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id, {include: [{ model: models.Realm, as: 'Realm' }]});

	if (!userEntry || !userEntry.canvasToken)
	{
		await interaction.reply({content: '`❗` You must setup your Canvas LMS account before you can view it!', ephemeral: true});
		return;
	}
	
	await interaction.deferReply();
	const { canvas } = await getCanvas(userEntry.Realm.url, userEntry.canvasToken);


	await interaction.followUp({embeds: [await canvasprofileEmbed(interaction, canvas)]});
}

export async function account_setup(interaction)
{
	const modalInteraction = await showAndAwaitModal(interaction, setcanvasaccountModal());
	if (!modalInteraction)
		return;

	// Strip protocol and /api/* if present, also strip trailing slash
	const realm = modalInteraction.fields.getTextInputValue('realm').replace(/\/api\/.*/, '').replace(/^(https?:\/\/)?/, '').replace(/\/$/, '').trim();
	const token = modalInteraction.fields.getTextInputValue('token').trim();

	await modalInteraction.deferReply({ephemeral: true});

	const { canvas, user } = await getCanvas(realm, token);
	const { models } = await getSequelize();

	const [realmEntry, realmCreated] = await models.Realm.findOrCreate({where: {url: realm}});
	const [userEntry, userCreated] = await models.User.findOrCreate({where: {discordId: modalInteraction.user.id}});

	userEntry.canvasToken = token;
	userEntry.realmId = realmEntry.realmId;
	await userEntry.save();

	await modalInteraction.followUp({content: `\`✅\` The account #**${user.id}** has been linked!`, embeds: [await canvasprofileEmbed(interaction, canvas)]});
}

export async function account_remove(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id);

	if (!userEntry || !userEntry.canvasToken)
	{
		await interaction.reply({content: "`🗑️` No changes made, your profile doesn't have a Canvas LMS account linked to it!", ephemeral: true});
		return;
	}

	userEntry.canvasToken = null;
	userEntry.realmId = null;
	await userEntry.save();

	await interaction.reply({content: '`🗑️` Successfully removed your Canvas LMS account!', ephemeral: true});
}

export async function protectedCommandInteraction(interaction, callback)
{
	try { await callback(interaction); }
	catch (ex)
	{
		switch (ex.name)
		{
			case 'RequestError':
				await fallbackReply(interaction, '`❌` Connection failed, could be due to a bad URL or connectivity issues.');
				break;

			case 'CanvasApiError':
				if (ex.code === 401)
					await fallbackReply(interaction, '`🔐` Authorization failed, this is likely to be caused by a bad token.');
				else if (ex.code === 404)
					await fallbackReply(interaction, '`❌` Canvas LMS API not found for URL.');
				else
					throw ex;
				break;
			
			default:
				throw ex;
		}
	}
}

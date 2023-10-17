import { assertActionOwnership, setActionOwner } from '../../util/asyncmutex.js';
import { SlashCommandBuilder } from 'discord.js';
import { getCanvas } from '../../canvas/connection.js';
import { getSequelize } from '../../database/connection.js';
import { persistentReply } from '../handling.js';
import canvasprofileEmbed from '../embeds/canvasprofile.embed.js';
import setcanvasaccountModal from '../modals/setcanvasaccount.modal.js';

export const command = new SlashCommandBuilder()
	.setName('canvas')
	.setDescription('Canvas LMS account configuration')
	.addSubcommandGroup(group => group
		.setName('account')
		.setDescription('Manage your Canvas LMS account integration')
		.addSubcommand(subcommand => subcommand
			.setName('status')
			.setDescription('Show details about the currently linked Canvas LMS account')
		)
		.addSubcommand(subcommand => subcommand
			.setName('setup')
			.setDescription('Setup a new Canvas LMS account to be linked with your Discord account')
		)
		.addSubcommand(subcommand => subcommand
			.setName('remove')
			.setDescription('Remove the currently linked Canvas LMS account from your Discord account')
		)
	);

async function subcommand_account_status(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id, {include: [{ model: models.Realm, as: 'Realm' }]});

	if (!userEntry || !userEntry.canvasToken)
	{
		await interaction.reply({content: '`❌` No Canvas LMS account setup for your Discord account.', ephemeral: true});
		return;
	}
	
	await interaction.deferReply();
	const { userData } = await getCanvas(userEntry.Realm.url, userEntry.canvasToken);	

	await interaction.followUp({embeds: [canvasprofileEmbed(userEntry.Realm.url, userData)]});
}

async function subcommand_account_setup(interaction)
{
	setActionOwner(interaction.id, interaction.user.id, setcanvasaccountModal.data.custom_id);
	await interaction.showModal(setcanvasaccountModal);

	let modalInteraction;
	try { modalInteraction = await interaction.awaitModalSubmit({time: 60000}); }
	catch { return; };

	if (!assertActionOwnership(interaction.id, interaction.user.id, setcanvasaccountModal.data.custom_id))
		return;
	
	// Strip protocol and /api/* if present, also strip trailing slash
	const realm = modalInteraction.fields.getTextInputValue('realm').replace(/\/api\/.*/, '').replace(/^(https?:\/\/)?/, '').replace(/\/$/, '').trim();
	const token = modalInteraction.fields.getTextInputValue('token').trim();

	await modalInteraction.deferReply({ephemeral: true});

	const { userData } = await getCanvas(realm, token);
	const { models } = await getSequelize();

	const [realmEntry, realmCreated] = await models.Realm.findOrCreate({where: {url: realm}});
	const [userEntry, userCreated] = await models.User.findOrCreate({where: {discordId: modalInteraction.user.id}});

	userEntry.canvasToken = token;
	userEntry.realmId = realmEntry.realmId;
	await userEntry.save();

	await modalInteraction.followUp({content: `\`✅\` The account #**${userData.id}** has been linked!`, embeds: [canvasprofileEmbed(realm, userData)]});
}

async function subcommand_account_remove(interaction)
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

export async function execute(interaction)
{
	try
	{
		switch (interaction.options.getSubcommandGroup())
		{
			case 'account':
				switch (interaction.options.getSubcommand())
				{
					case 'status':
						await subcommand_account_status(interaction);
						break;

					case 'setup':
						await subcommand_account_setup(interaction);
						break;

					case 'remove':
						await subcommand_account_remove(interaction);
						break;
				}
				break;
		}

	}
	catch (ex)
	{
		switch (ex.code)
		{
			case 'ENOTFOUND':
			case 404:
				persistentReply(interaction, "`❌` Couldn't access the page from the provided URL.");
				break;

			case 401:
				persistentReply(interaction, "`❌` Authorization failed, the provided token is likely invalid.");
				break;

			default:
				throw ex;
		}
	}
}

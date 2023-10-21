import { SlashCommandBuilder } from 'discord.js';
import { getCanvas } from '../../canvas/connection.js';
import { getSequelize } from '../../database/connection.js';
import { fallbackReply, replies } from '../reply.js';
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

async function subcommand_account_view(interaction)
{
	const { models } = await getSequelize();
	const userEntry = await models.User.findByPk(interaction.user.id, {include: [{ model: models.Realm, as: 'Realm' }]});

	if (!userEntry || !userEntry.canvasToken)
	{
		await interaction.reply({content: replies.nocanvas, ephemeral: true});
		return;
	}
	
	await interaction.deferReply();
	const { userData } = await getCanvas(userEntry.Realm.url, userEntry.canvasToken);	

	await interaction.followUp({embeds: [canvasprofileEmbed(userEntry.Realm.url, userData)]});
}

async function subcommand_account_setup(interaction)
{
	const modalInteraction = await showAndAwaitModal(interaction, setcanvasaccountModal());
	if (!modalInteraction)
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
			default:
				switch (interaction.options.getSubcommand())
				{
					case 'view':
						await subcommand_account_view(interaction);
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
			case 'ETIMEDOUT':
			case 'ENOTFOUND':
			case 'ENETUNREACH':
			case 404:
				fallbackReply(interaction, replies.badconnection);
				break;

			case 401:
				fallbackReply(interaction, replies.badtoken);
				break;

			default:
				throw ex;
		}
	}
}

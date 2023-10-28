import { EmbedBuilder } from 'discord.js';
import { getSelf } from '../../canvas/data/user.js';
import { getBranding } from '../../canvas/data/realm.js';

export default async function build(interaction, canvas)
{
	const [branding, user] = await Promise.all([getBranding(canvas), getSelf(canvas)]);

	return new EmbedBuilder()
		.setColor(0xE72429)
		.setTitle(user.name)
		.setAuthor({name: `${interaction.memberUser.displayName}'s Canvas account`, iconURL: interaction.memberUser.displayAvatarURL()})
		.setThumbnail(user.avatar_url)
		.setDescription(`Account **${user.id}**`)
		.setFooter({text: `Fetched from ${canvas.gotClient.defaults.options.url.hostname}`, iconURL: branding['ic-brand-msapplication-tile-square']});
}

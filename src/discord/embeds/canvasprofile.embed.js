import { EmbedBuilder } from 'discord.js';

export default function build(realm, userData)
{
	return new EmbedBuilder()
		.setColor(0xE72429)
		.setTitle(userData.name)
		.setDescription(`#${userData.id}`)
		.setThumbnail(userData.avatar_url)
		.addFields({ name: `Realm`, value: `https://${realm}` });
}

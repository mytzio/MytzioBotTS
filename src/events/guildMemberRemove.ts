import Event from '../base/Event';
import { GuildMember, MessageEmbed, Client } from 'discord.js';

import config from '../config.json';

export default class MemberLeftEvent extends Event {

  constructor (client: Client) {
    super(client, 'guildMemberRemove');
  }

  public async execute(_client: Client, member: GuildMember) {

    // Log user traffic
    const guild = config.guilds.find(g => g.id === member.guild.id);
    const logChannel: any = member.guild.channels.cache.find(c => c.id === guild?.log.traffic);

    if (!logChannel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} has left the server!`, member.user.displayAvatarURL())
      .setColor('RED')
      .setThumbnail(member.user.displayAvatarURL())
      .addFields(
        { name: 'Username', value: member?.user.username || '-', inline: true },
        { name: 'Discriminator', value: member?.user.discriminator || '-', inline: true },
        { name: 'Bot account', value: member?.user.bot ? 'Yes' : 'No', inline: true },

        { name: 'User ID', value: member?.user.id || '-', inline: true },
        { name: 'Created at', value: member?.user.createdAt.toLocaleDateString(), inline: true },
        { name: 'Joined at', value: member?.joinedAt?.toLocaleDateString(), inline: true },
      );

    logChannel.send(embed);
  }
}
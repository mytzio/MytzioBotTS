import Event from '../base/classes/Event';
import { GuildMember, MessageEmbed, Client } from 'discord.js';
import defaultRole from '../base/functions/defaultRole';

import config from '../config.json';

export default class MemberJoinEvent extends Event {

  constructor () {
    super('guildMemberAdd');
  }

  public async execute(_client: Client, member: GuildMember) {

    // Assign role to a new member
    defaultRole(member);

    // Log user traffic
    const guild = config.guilds.find(g => g.id === member.guild.id);
    const logChannel: any = member.guild.channels.cache.find(c => c.id === guild?.log.traffic);

    if (!logChannel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} has joined the server!`, member.user.displayAvatarURL())
      .setColor('GREEN')
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
import Bot from '../client/client';
import { GuildMember, GuildChannel, MessageEmbed } from 'discord.js';

export = class ReadyEvent extends Bot {

  public async execute(member: GuildMember) {
    const logChannel: any = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'logger');

    if (!logChannel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} has joined the server!`, member.user.displayAvatarURL())
      .setColor('GREEN')
      .setThumbnail(member.user.displayAvatarURL())
      .addField('Nickname', member.displayName, true)
      .addField('Joined Discord', member.user.createdAt?.toLocaleDateString(), true)
      .addField('Joined Server', member.joinedAt?.toLocaleDateString(), true)
      .setFooter(`ID: ${member.id}`)
      .setTimestamp()

    logChannel.send(embed);
  }
}
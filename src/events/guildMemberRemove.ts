import Event from '../base/Event';
import { GuildMember, GuildChannel, MessageEmbed, Client } from 'discord.js';

export default class MemberLeftEvent extends Event {

  constructor(client: Client) {
    super(client, 'guildMemberRemove')
  }

  public async execute(_client: Client, member: GuildMember) {
    const logChannel: any = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'logger');

    if (!logChannel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${member.user.tag} has left the server!`, member.user.displayAvatarURL())
      .setColor('RED')
      .setThumbnail(member.user.displayAvatarURL())
      .addField('Nickname', member.displayName, true)
      .addField('Joined Discord', member.user.createdAt?.toLocaleDateString(), true)
      .addField('Joined Server', member.joinedAt?.toLocaleDateString(), true)
      .setFooter(`ID: ${member.id}`)
      .setTimestamp()

    logChannel.send(embed);
  }
}
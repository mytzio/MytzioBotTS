import Bot from '../client/client';
import { GuildMember, GuildChannel } from 'discord.js';

export = class ReadyEvent extends Bot {

  public async execute(member: GuildMember) {
    const logChannel: any = member.guild.channels.cache.find((ch: GuildChannel) => ch.name === 'logger');

    if (!logChannel) return;

    logChannel.send(`**${member.user.username}**, has left the server!`).catch(console.error);
  }
}
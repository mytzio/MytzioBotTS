import { GuildMember } from 'discord.js';

import config from '../../config.json';

export default function defaultRole(member: GuildMember) {
  if (member.user.bot) return;

  const guildConfig = config.guilds.find(g => g.id === member.guild.id);
  if (guildConfig) {
    const isRole = member.guild.roles.cache.find(r => r.id === guildConfig.default.role);
    const hasRole = member.roles.cache.find(r => r.id === guildConfig.default.role);

    if (isRole && !hasRole) member.roles.add(isRole);
  }
}
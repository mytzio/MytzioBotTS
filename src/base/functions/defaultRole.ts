import { GuildMember } from 'discord.js';

import config from '../../config.json';

export default function defaultRole(member: GuildMember) {
  const guildConfig = config.guilds.find(g => g.id === member.guild.id);
  if (guildConfig) {
    if (member.user.bot && guildConfig.default.role.exclude.bot) return;

    const isRole = member.guild.roles.cache.find(r => r.id === guildConfig.default.role.id);
    const hasRole = member.roles.cache.find(r => r.id === guildConfig.default.role.id);

    if (isRole && !hasRole) member.roles.add(isRole);
  }
}
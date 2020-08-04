import Event from '../base/Event';
import { Client, Presence } from 'discord.js';

import config from '../config.json';

export default class PresenceEvent extends Event {

  constructor (client: Client) {
    super(client, 'presenceUpdate');
  }

  public async execute(_client: Client, _oldPresence: Presence, newPresence: Presence) {
    const guildConfig = config.guilds.find(g => g.id === newPresence.guild?.id);
    if (guildConfig) {
      guildConfig.activity.forEach(activity => {
        const isActivity = newPresence.activities.find(a => a.type === activity.type);
        const isRole = newPresence.guild?.roles.cache.find(r => r.id === activity.role);
        const hasRole = newPresence.member?.roles.cache.find(r => r.id === activity.role);

        if (isActivity && isRole) newPresence.member?.roles.add(isRole);
        if (!isActivity && isRole && hasRole) newPresence.member?.roles.remove(isRole);
      });
    }
  }
}
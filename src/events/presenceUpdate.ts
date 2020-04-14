import Bot from '../client/client';
import { Client, Presence } from 'discord.js';

export default class PresenceEvent extends Bot {

  constructor(client: Client) {
    super();
    this.client = client;
  }

  public async execute(_oldPresence: Presence, newPresence: Presence) {
    const guilds = [
      {
        id: '271021464952504330',
        activity: [
          {
            name: 'LIVE',
            type: 'STREAMING',
          },
        ],
      }
    ];
    
    const thisGuild = guilds.find(g => g.id === newPresence.guild?.id);

    // Check if guild is listed
    if (thisGuild) {

      // Check every listed guild
      thisGuild.activity?.forEach(act => {
        const guild = this.client.guilds.cache.get(thisGuild.id);
        const member = guild?.members.cache.find(m => m.id === newPresence.user?.id);

        // Check when user have activities
        if (newPresence.activities) {
          const activity = newPresence.activities.find(a => a.type === act.type);
          const guildRoles = guild?.roles.cache.find(r => r.name === act.name);

          // 1. Check if user activity is found in this guild's scope
          // 2. Check if role exists in guild
          // 3. Add role to member
          if (activity && guildRoles) {
            member?.roles.add(guildRoles).catch(e => console.error(e));
          }
          
          const memberRoles = member?.roles.cache.find(r => r.name === act.name);
          
          // 1. Check if user activity is NOT found in this guild's scope
          // 2. Check if user has the role specified for this guild's scope
          // 3. Check if role exists in guild
          // 4. Remove role from member
          if (!activity && memberRoles && guildRoles) {
            member?.roles.remove(guildRoles).catch(e => console.error(e));
          }
        }
      })
    }
  }
}
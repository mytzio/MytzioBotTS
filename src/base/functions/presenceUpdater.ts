import { Client } from 'discord.js';

export default function presenceUpdater(client: Client) {
  client.user?.setPresence({
    activity: {
      name: `${client.guilds.cache.size} servers!`,
      type: 'WATCHING',
    }
  });
}
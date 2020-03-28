import { Client } from 'discord.js'

export default class Command {

  public client: Client;
  public config: { enabled: boolean; guildOnly: boolean; aliases: any[]; permLevel: string; };
  public help: { name: string; description: string; usage: string; category: string; };

  constructor(client: Client, {
    name = 'No name provided',
    description = 'No description provided',
    usage = 'No usage provided',
    category = 'Miscelaneous',
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permLevel = 'User'
  }) {
    this.client = client;
    this.config = { enabled, guildOnly, aliases, permLevel };
    this.help = { name, description, usage, category };
  }
}
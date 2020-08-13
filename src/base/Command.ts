import { Client, PermissionString } from 'discord.js';

export default class Command {

  public client: Client;
  public config: { enabled: boolean; guildOnly: boolean; aliases: string[]; permissions: PermissionString[]; };
  public help: { name: string; description: string; usage: string[]; category: string; };

  constructor (client: Client, {
    name = 'No name provided',
    description = 'No description',
    usage = new Array(),
    category = 'Miscelaneous',
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permissions = new Array()
  }) {
    this.client = client;
    this.config = { enabled, guildOnly, aliases, permissions };
    this.help = { name, description, usage, category };
  }
}
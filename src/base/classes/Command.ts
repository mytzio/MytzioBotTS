import { PermissionString } from 'discord.js';

export default class Command {

  public config: { enabled: boolean; guildOnly: boolean; aliases: string[]; permissions: PermissionString[]; };
  public help: { name: string; description: string; usage: string[]; category: string; };

  constructor ({
    name = 'No name provided',
    description = 'No description',
    usage = new Array(),
    category = 'Miscelaneous',
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    permissions = new Array()
  }) {
    this.config = { enabled, guildOnly, aliases, permissions };
    this.help = { name, description, usage, category };
  }
}
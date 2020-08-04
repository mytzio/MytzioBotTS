import Event from '../base/Event';
import { Client, Message } from 'discord.js';

import config from '../config.json';

export default class MessageEvent extends Event {

  constructor (client: Client) {
    super(client, 'message');
  }

  public async execute(_client: Client, message: Message) {

    // Ignore other bots and their messages
    if (message.author.bot) return;

    const guild = config.guilds.find(g => g.id === message.guild?.id);
    const prefix = guild?.prefix || config.default.prefix;

    // Run only when message starts with prefix
    if (message.content.startsWith(prefix)) {

      const args = message.content.slice(prefix.length).split(/ +/g);
      const commandName = args.shift()?.toLowerCase();
      const command: any = _client.commands.get(commandName) ||
        _client.commands.find((cmd: any) => cmd.config.aliases && cmd.config.aliases.includes(commandName));

      // Return command cannot be found
      if (!command) return;

      // is command enabled?
      if (!command.config.enabled) return;

      // permissions
      if (command.config.permLevel !== 'User') {
        const permsDenied = 'You are not allowed to use that command';
        if (command.config.permLevel === 'Mod' && !message.member?.hasPermission(4)) {
          message.channel.send(permsDenied);
          return;
        }
        else if (command.config.permLevel === 'Admin' && !message.member?.hasPermission(8)) {
          message.channel.send(permsDenied);
          return;
        }
        else if (command.config.permLevel === 'Owner' && message.member?.id !== '271016450750283776') {
          message.channel.send(permsDenied);
          return;
        }
      }

      // is command guildOnly?
      if (command.config.guildOnly && message.channel.type === 'dm') {
        message.channel.send('Command you are trying to execute is only accessible in guild!');
        return;
      }

      try {
        command.execute(_client, message, args);
      } catch (e) {
        this.client.logger.error(e);
        message.channel.send('There was an error trying to execute that command').catch(console.error);
      }
    }
  }
}
import Event from '../base/classes/Event';
import { Message } from 'discord.js';

import config from '../config.json';

export default class MessageEvent extends Event {

  constructor () {
    super('message');
  }

  public async execute(_client: any, message: Message) {

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
      if (!command.config.permissions.every((permission: any) => message.member?.permissions.toArray().includes(permission))) {
        message.channel.send('You don\'t have permissions to run this command');
        return;
      }

      // is command guildOnly?
      if (command.config.guildOnly && message.channel.type === 'dm') {
        message.channel.send('Command you are trying to execute is only accessible in guild!');
        return;
      }

      try {
        command.execute(_client, message, args);
      } catch (e) {
        _client.logger.error(e);
        message.channel.send('There was an error trying to execute that command').catch(console.error);
      }
    }
  }
}
import { Client, Message } from 'discord.js';
import Bot from '../client/client';

export default class MessageEvent extends Bot {
  public prefix: string;

  constructor (client: Client) {
    super()
    this.client = client;
    this.prefix = '.';
  }

  public async execute(message: Message) {
    
    // Ignore other bots and their messages
    if (message.author.bot) return;

    // Run only when message starts with prefix
    if (message.content.startsWith(this.prefix)) {

      const args = message.content.slice(this.prefix.length).split(/ +/g);
      const commandName = args.shift()?.toLowerCase();
      const command: any = this.client.commands.get(commandName) || 
      this.client.commands.find((cmd: any) => cmd.config.aliases && cmd.config.aliases.includes(commandName));

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
      if (command.config.guildOnly && message.channel.type === 'dm' ) {
        message.channel.send('Command you are trying to execute is only accessible in guild!');
        return;
      }

      try {
        command.execute(this.client, message, args);
      } catch (e) {
        console.error(e);
        message.channel.send('There was an error trying to execute that command').catch(console.error);
      }
    }
  }
}
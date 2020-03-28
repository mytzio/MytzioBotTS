import { Client, Collection, Message } from 'discord.js';
import Bot from '../client/client';

export = class MessageEvent extends Bot {
  public prefix: string;

  constructor (client: Client, commands: Collection<unknown, unknown>) {
    super()
    this.client = client
    this.commands = commands
    this.prefix = '.'
  }

  public async execute(message: Message) {
    
    // Ignore other bots and their messages
    if (message.author.bot) return;

    // Run only when message starts with prefix
    if (message.content.startsWith(this.prefix)) {

      const args = message.content.slice(this.prefix.length).split(/ +/g);
      const commandName = args.shift()?.toLowerCase();
      const command: any = this.commands.get(commandName) || 
      this.commands.find((cmd: any) => cmd.config.aliases && cmd.config.aliases.includes(commandName))

      // Return command cannot be found
      if (!command) return;

      try {
        command.execute(this.client, message, args)
      } catch (e) {
        console.error(e);
        message.channel.send('There was an error trying to execute that command');
      }
    }
  }
}
import { Client, Message } from "discord.js";
import Command from '../../base/classes/Command';

export default class Say extends Command {
  constructor () {
    super({
      name: 'say',
      description: 'Say something as a bot',
      permissions: ['ADMINISTRATOR']
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    _message.delete();
    _message.channel.startTyping();
    setTimeout(() => {
      _message.channel.send(_args.join(' '));
      _message.channel.stopTyping();
    }, 2000);
  }
}
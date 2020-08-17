import { Client, Message } from "discord.js";
import Command from '../../base/classes/Command';

export default class Test extends Command {
  constructor () {
    super({
      name: 'test',
      description: 'Testing command',
      permissions: ['KICK_MEMBERS']
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {

    console.log('test command');
  }
}
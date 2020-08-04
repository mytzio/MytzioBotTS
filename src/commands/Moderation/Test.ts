import { Client, Message } from "discord.js";
import Command from '../../base/Command';

export default class Test extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'test',
      description: 'Testing command',
      permLevel: 'Mod'
    });
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {

    console.log(await _message.guild?.fetchPreview());
  }
}
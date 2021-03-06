import { Client, Message } from "discord.js";
import Command from '../../base/classes/Command';

export default class Ping extends Command {
  constructor () {
    super({
      name: 'ping',
      description: 'API response time',
      aliases: ['latency'],
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    _message.channel.send(`My ping is ${_client.ws.ping}ms!`);
  }
}
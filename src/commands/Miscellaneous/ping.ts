import { Client, Message } from "discord.js";
import Command from '../../base/Command';

export = class Ping extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'ping',
      description: 'API response time',
      aliases: ['latency'],
    })
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    try {
      _message.channel.send(`My ping is ${_client.ws.ping}ms!`);
    } catch (e) {
      console.error(e);
    }
  }
}
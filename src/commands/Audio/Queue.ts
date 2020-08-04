import Command from '../../base/Command';
import { Client, Message } from "discord.js";
import { cache } from '../../base/Dispatcher';

export default class Queue extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'queue',
      aliases: ['q', 'list'],
      description: 'List up to 10 upcoming songs',
    });
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    const mediaPlayer = cache.get(_message.guild?.id)?.queue;
    if (!mediaPlayer) return _message.channel.send('There is no music playing at the moment!');

    return _message.channel.send(await mediaPlayer.queue().message);
  }
}
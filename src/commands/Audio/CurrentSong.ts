import Command from '../../base/Command';
import { Client, Message } from "discord.js";
import { cache } from '../../base/Dispatcher';

export default class Play extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'currentsong',
      aliases: ['song'],
      description: 'Show currently playing song',
    });
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {

    const mediaPlayer = cache.get(_message.guild?.id)?.queue;
    if (!mediaPlayer) return _message.channel.send('There is no music playing at the moment!');

    return _message.channel.send(await mediaPlayer.song().message);
  }
}
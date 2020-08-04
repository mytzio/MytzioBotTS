import Command from '../../base/Command';
import { Client, Message } from "discord.js";
import { cache } from '../../base/Dispatcher';

export default class Shuffle extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'shuffle',
      description: 'Shuffle track queue',
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    if (!_message.member?.voice.channel) return _message.channel.send('You have to be in a voice channel!');

    const mediaPlayer = cache.get(_message.guild?.id)?.queue;
    if (!mediaPlayer) return _message.channel.send('There is no music in queue at the moment!');

    return _message.channel.send(await mediaPlayer.shuffle().message);
  }
}
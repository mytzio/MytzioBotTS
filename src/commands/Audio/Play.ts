import Command from '../../base/Command';
import { Client, Message } from "discord.js";
import Dispatcher, { cache } from '../../base/Dispatcher';

export default class Play extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'play',
      aliases: ['sr'],
      description: 'Plays audio stream',
    });
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    if (!_message.member?.voice.channel) return _message.channel.send('You have to be in a voice channel!');

    const guild = cache.get(_message.guild?.id);

    if (!_args.length) {
      if (guild) return _message.channel.send(await guild.queue.resume().message);
      else return _message.channel.send('You did not provide a song to play!');
    }

    if (!guild) {
      cache.set(_message.guild?.id, new Dispatcher());
      const guild = cache.get(_message.guild?.id);
      return guild.play(_message, _args);
    } else {
      return guild.play(_message, _args);
    }
  }
}
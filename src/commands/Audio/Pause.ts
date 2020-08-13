import Command from '../../base/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Pause extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'pause',
      description: 'Pause audio track',
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {

    if (!_message.member?.voice.channel) return _message.channel.send('You have to be in a voice channel!');

    const guild = _message.guild as GuildExtension;
    if (!guild?.media.player.connection) return _message.channel.send('There is no music playing at the moment!');

    return guild?.media.player.pause();
  }
}
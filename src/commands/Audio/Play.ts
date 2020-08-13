import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Play extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'play',
      aliases: ['sr'],
      description: 'Plays audio stream',
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {

    if (!_message.member?.voice.channel) return _message.channel.send('You have to be in a voice channel!');

    const guild = _message.guild as GuildExtension;
    return guild?.media.player.play(_message, _args.join(' '));
  }
}
import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Song extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'currentsong',
      aliases: ['song'],
      description: 'Show currently playing song',
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {

    const guild = _message.guild as GuildExtension;
    if (!guild?.media.player.connection) return _message.channel.send('There is no music playing at the moment!');

    return guild?.media.player.song();
  }
}
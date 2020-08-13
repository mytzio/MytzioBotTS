import Command from '../../base/classes/Command';
import { Client, Message } from "discord.js";
import GuildExtension from '../../base/structures/Guild';

export default class Queue extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'queue',
      aliases: ['q', 'list'],
      description: 'List up to 10 upcoming songs',
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {

    const guild = _message.guild as GuildExtension;
    if (!guild?.media.player.connection) return _message.channel.send('There is no music playing at the moment!');

    return guild?.media.player.queue();
  }
}
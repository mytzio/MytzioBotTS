import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/classes/Command';

export default class Help extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'help',
      description: 'Get some help',
      aliases: ['h'],
    });
  }

  public async execute(_client: any, _message: Message, _args: string[]) {
    if (_args[0] && _client.commands.has(_args[0])) {
      const command = _client.commands.get(_args[0]);

      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(`${command.help.name.toUpperCase()} Command`)
        .addField('Description', command.help.description, true)
        .addField('Usage', command.help.usage, true);

      return _message.channel.send(embed);
    }
    return;
  }
}
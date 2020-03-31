import { Client, Message } from "discord.js";
import Command from '../../base/Command';

export = class Region extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'region',
      description: 'Change server region',
      aliases: ['reg'],
      usage: ['regionName'],
      guildOnly: true,
      permLevel: 'Mod'
    })
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    if (!_message.guild?.available) return;

    if (_args.length < 1) return _message.channel.send(`Current guild region is ${_message.guild.region}`);

	  try {
		  const updated = await _message.guild.setRegion(_args[0]);
		  return _message.channel.send(`Updated guild region to ${updated.region}`);
	  }
	  catch (e) {
		  return console.error(e);
	  }
  }
}
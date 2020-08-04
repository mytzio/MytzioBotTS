import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/Command';

export default class ServerInfo extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'serverinfo',
      description: 'Shows info about the server',
      aliases: ['sinfo'],
    });
  }


  public async execute(_client: Client, _message: Message, _args: string[]) {
    const embed = new MessageEmbed()
      .setAuthor(_message.guild?.name, _message.guild?.iconURL() || undefined)
      .setDescription(_message.guild?.description ? _message.guild.description : 'No description')
      .setThumbnail(_message.guild?.iconURL() || '-')
      .setColor('RANDOM')

      .addFields(
        { name: 'Server owner', value: _message.guild?.owner, inline: true },
        { name: 'Region', value: _message.guild?.region, inline: true },
        { name: 'Server ID', value: _message.guild?.id, inline: true },

        { name: 'Members', value: _message.guild?.memberCount, inline: true },
        { name: 'Emojis', value: _message.guild?.emojis.cache.size, inline: true },
        { name: 'Server boosts', value: _message.guild?.premiumSubscriptionCount, inline: true },

        { name: 'Verification level', value: _message.guild?.verificationLevel, inline: true },
        { name: 'Verified', value: _message.guild?.verified ? 'YES' : 'NO', inline: true },
        { name: 'Partnered', value: _message.guild?.partnered ? 'YES' : 'NO', inline: true },

        { name: 'Features', value: _message.guild?.features.length ? _message.guild.features : '-' },
      )

      .setFooter(`Server created | ${_message.guild?.createdAt}`);

    return _message.channel.send(embed);
  }
}
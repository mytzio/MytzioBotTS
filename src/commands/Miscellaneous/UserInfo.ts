import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/classes/Command';

export default class UserInfo extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'userinfo',
      description: 'Shows info about the user',
      aliases: ['uinfo'],
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    let member = _message.mentions.members?.first() || _message.guild?.members.cache.find(user => user.displayName.toLowerCase() === _args[0]);

    if (!_args.length) member = _message.member || undefined;
    if (!member) return _message.channel.send('Could not find that user!');

    const embed = new MessageEmbed()
      .setAuthor(member?.user.tag, member?.user.avatarURL() || undefined)
      .setThumbnail(member?.user.avatarURL() || '-')
      .setColor(member.displayHexColor)

      .addFields(
        { name: 'Username', value: member?.user.username || '-', inline: true },
        { name: 'Discriminator', value: member?.user.discriminator || '-', inline: true },
        { name: 'Bot account', value: member?.user.bot ? 'Yes' : 'No', inline: true },
        { name: 'User ID', value: member?.user.id || '-' },

        { name: 'Created at', value: member?.user.createdAt },
        { name: '\u200B', value: '\u200B' },

        { name: 'Nickname', value: member?.displayName || '-', inline: true },
        { name: 'Boosting', value: member?.premiumSince ? 'Yes' : 'No', inline: true },
        { name: 'Last message', value: member?.lastMessage || '-', inline: true },
        { name: 'Roles', value: member?.roles.cache.filter(r => r.name !== '@everyone').map(r => r).join(', ') || '-' },

        { name: 'Joined at', value: member?.joinedAt },
      );

    return _message.channel.send(embed);
  }
}
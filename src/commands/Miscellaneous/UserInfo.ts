import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/classes/Command';

export default class UserInfo extends Command {
  constructor () {
    super({
      name: 'userinfo',
      description: 'Shows info about the user',
      aliases: ['uinfo'],
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    let member = _message.mentions.members?.first() || _message.guild?.members.cache.find(user => user.displayName.toLowerCase() === _args[0]);

    if (!_args.length) member = _message.member || undefined;
    if (!member) return _message.channel.send('Could not find that user!').catch(console.error);

    const embed = new MessageEmbed()
      .setThumbnail(member.user.avatarURL() ?? member.user.defaultAvatarURL)
      .setColor('BLUE')

      .addFields(
        { name: 'Username', value: member.user.tag, inline: true },
        { name: 'User ID', value: member.user.id, inline: true },
        { name: 'Flags', value: member.user.flags ? member.user.flags.toArray() : 'None' },
        { name: 'Created At', value: member.user.createdAt },

        { name: '\u200B', value: '\u200B' },

        { name: 'Nickname', value: member.displayName, inline: true },
        { name: 'Last Message', value: member.lastMessage, inline: true },
        { name: 'Roles', value: member.roles.cache.filter(r => r.name !== '@everyone').map(r => r).join(' ') },
        { name: 'Joined At', value: member.joinedAt },
      );

    return _message.channel.send(embed).catch(console.error);
  }
}
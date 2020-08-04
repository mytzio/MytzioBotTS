import { Message, TextChannel, DMChannel, NewsChannel, VoiceChannel, MessageEmbed } from 'discord.js';

export default class MediaPlayer {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel | null | undefined;
  connection: any;
  currentSong: any;
  songs: any;
  playing: boolean;
  loop: number;

  constructor (message: Message) {
    this.textChannel = message.channel;
    this.voiceChannel = message.member?.voice.channel;
    this.connection = null;
    this.songs = [];
    this.playing = true;
    this.loop = 0;
  }

  public volume(value: number) {
    if (value < 0 || value > 200) return { message: 'Volume can only be between 0 and 200' };
    this.connection.dispatcher.setVolumeLogarithmic(value / 100);
    return { message: `Media player volume set to ${value}%` };
  }

  public song() {
    return { message: `${this.songs[0].title} | Requested By ${this.songs[0].requestedBy}` };
  }

  public queue() {
    let songCount = this.songs.length;
    songCount > 10 ? songCount = 10 : songCount = this.songs.length;

    let list = '';
    for (let i = 1; i <= songCount; i++) {
      list += `\n#${i} ${this.songs[i - 1].title}`;
    }

    const embed = new MessageEmbed()
      .setTitle('Playlist')
      .setDescription(list);

    return { message: embed };
  }

  public shuffle() {
    const arr = this.songs;

    let length = this.songs.length;
    while (length) {
      const index = Math.floor(Math.random() * length--);
      [arr[length], arr[index]] = [arr[index], arr[length]];
    }

    this.songs = arr;
    return { message: 'Queue has been shuffled!' };
  }

  public resume() {
    this.connection?.dispatcher.resume();
    this.playing = true;
    return { message: 'Media player resumed!' };
  }

  public pause() {
    this.connection?.dispatcher.pause();
    this.playing = false;
    return { message: 'Media player paused!' };
  }

  public skip(index?: number) {
    if (!index || index < 2) {
      this.connection?.dispatcher.end();
      return { message: 'Song has been skipped!' };
    } else if (index >= 2 && index - 1 < this.songs.length) {
      const removed = this.songs[index - 1].title;
      this.songs.splice(index - 1, 1);
      return { message: `Skipped song at position #${index} which was ${removed}` };
    } else {
      return { message: 'Could not skip that song!' };
    }
  }

  public stop() {
    this.connection?.dispatcher.end();
    this.songs = [];
    return { message: 'Media player stopped!' };
  }
}
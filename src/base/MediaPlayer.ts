import { Message, TextChannel, DMChannel, NewsChannel, VoiceChannel } from 'discord.js';

export default class MediaPlayer {
  textChannel: TextChannel | DMChannel | NewsChannel;
  voiceChannel: VoiceChannel | null | undefined;
  connection: any;
  currentSong: {};
  songs: any[];
  playing: boolean;
  loop: number;

  constructor (message: Message) {
    this.textChannel = message.channel;
    this.voiceChannel = message.member?.voice.channel;
    this.connection = null;
    this.currentSong = {};
    this.songs = [];
    this.playing = true;
    this.loop = 0;
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

  public skip() {
    this.connection?.dispatcher.end();
    return { message: 'Song has been skipped!' };
  }

  public stop() {
    this.connection?.dispatcher.end();
    this.songs = [];
    return { message: 'Media player stopped!' };
  }
}
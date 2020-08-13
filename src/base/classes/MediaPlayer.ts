import { TextChannel, VoiceChannel, MessageEmbed, VoiceConnection, Message, DMChannel, NewsChannel } from 'discord.js';
import axios from 'axios';
import YTDL from 'ytdl-core';
// import YTPL from 'ytpl';

export const cache = new Map();

export default class MediaPlayer {
  textChannel: TextChannel | DMChannel | NewsChannel | null;
  voiceChannel: VoiceChannel | null | undefined;
  connection: VoiceConnection | null | undefined;
  songs: any[];
  playing: boolean;

  constructor () {
    this.textChannel = null;
    this.voiceChannel = null;
    this.connection = null;
    this.songs = [];
    this.playing = true;
  }

  public volume(value: number) {
    if (value < 0 || value > 200) return this.textChannel?.send('Volume can only be between 0 and 200');
    this.connection?.dispatcher.setVolumeLogarithmic(value / 100);
    return this.textChannel?.send(`Media player volume set to ${value}%`);
  }

  public song() {
    return this.textChannel?.send(`${this.songs[0].title}`);
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

    return this.textChannel?.send(embed);
  }

  public shuffle() {
    const arr = this.songs;

    let length = this.songs.length;
    while (length) {
      const index = Math.floor(Math.random() * length--);
      [arr[length], arr[index]] = [arr[index], arr[length]];
    }

    this.songs = arr;
    return this.textChannel?.send('Queue has been shuffled!');
  }

  public resume() {
    this.connection?.dispatcher.resume();
    this.playing = true;
    return this.textChannel?.send('Media player resumed!');
  }

  public pause() {
    this.connection?.dispatcher.pause();
    this.playing = false;
    return this.textChannel?.send('Media player paused!');
  }

  public skip(index?: number) {
    if (!index || index < 2) {
      this.connection?.dispatcher.end();
      return this.textChannel?.send('Song has been skipped!');
    } else if (index >= 2 && index - 1 < this.songs.length) {
      const removed = this.songs[index - 1].title;
      this.songs.splice(index - 1, 1);
      return this.textChannel?.send(`Skipped song at position #${index} which was ${removed}`);
    } else {
      return this.textChannel?.send('Could not skip that song!');
    }
  }

  public stop() {
    this.connection?.dispatcher.end();
    this.songs = [];
    return this.textChannel?.send('Media player stopped!');
  }

  public async play(message: Message, query?: string) {
    this.textChannel = message.channel;
    this.voiceChannel = message.member?.voice.channel;
    if (!query) return;

    // Fetch ID's
    const videoIDArray = await this.getIDs(query);

    // Create songs and add them to queue
    for await (const videoID of videoIDArray) {
      const songInfo = await YTDL.getInfo(videoID);

      const song = {
        title: songInfo.title,
        url: songInfo.video_url
      };

      this.songs.push(song);
    }

    // Connect to a voice channel
    if (!this.connection) {
      await this.connectToVoice();
      this.playStream(this.songs[0]);
    }

    return this.textChannel?.send(`\`${this.songs[0].title}\` has been added to the queue!`);
  }

  private async getIDs(query: string) {
    // Validate ID by ID or URL
    if (YTDL.validateID(query) || YTDL.validateURL(query)) {
      try {
        return [YTDL.getVideoID(query)];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    // Validate playlist URL 
    // if (YTPL.validateURL(query)) {
    //   try {
    //     const playlistID = await YTPL.getPlaylistID(query);
    //     const playlist = await YTPL(playlistID, { limit: 0 });
    //     let list: string[] = [];
    //     playlist.items.forEach(item => {
    //       list.push(item.url_simple);
    //     });
    //     return list;
    //   } catch (e) {
    //     console.error(e);
    //     return [];
    //   }
    // }

    // Search results by query
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.YOUTUBE_API_TOKEN,
          maxResults: 5,
          order: 'relevance',
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: 10,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      return [response.data.items[0]?.id.videoId];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  private async connectToVoice() {
    this.connection = await this.voiceChannel?.join();
  }

  private async playStream(song: any) {
    if (!song) {
      this.reset();
      return;
    }

    const stream = YTDL(song.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
    });

    const dispatcher = this.connection?.play(stream, {
      bitrate: 'auto',
      highWaterMark: 1,
    });

    dispatcher?.on('error', (e: any) => {
      console.error(e);
      this.connection?.dispatcher.end();
    });

    dispatcher?.on('finish', () => {
      this.songs.shift();
      this.playStream(this.songs[0]);
    });

    const volume = 50;

    dispatcher?.setVolumeLogarithmic(volume / 100);
  }

  private reset() {
    this.voiceChannel?.leave();
    this.textChannel = null;
    this.voiceChannel = null;
    this.connection = null;
  }
}
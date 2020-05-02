import { Message } from 'discord.js';
import YTDL from 'ytdl-core';
import YTPL from 'ytpl';
import axios from 'axios';
import MediaPlayer from './MediaPlayer';

const PL: any = YTPL;

export const cache = new Map();

export default class Dispatcher {

  private queue: any;

  constructor () {
    this.queue;
  }

  private async getID(query: string) {
    if (YTDL.validateURL(query) || YTDL.validateID(query)) {
      try {
        return YTDL.getVideoID(query);
      } catch (e) {
        console.error(e);
        return null;
      }
    } else if (PL.validateURL(query)) {
      try {
        return PL.getPlaylistID(query);
      } catch (e) {
        console.error(e);
        return null;
      }
    } else {
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

        return response.data.items[0]?.id.videoId;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
  }

  private async queueConstruct(message: Message, song: {}) {
    const mediaPlayer = new MediaPlayer(message);

    this.queue = mediaPlayer;
    mediaPlayer.songs.push(song);

    try {
      const connection: any = await message.member?.voice.channel?.join();
      mediaPlayer.connection = connection;
      return this.executeStream(mediaPlayer.songs[0]);
    } catch (e) {
      console.error(e);
      delete this.queue;
      this.queue.voiceChannel.leave();
      return message.channel.send('I could not join the voice channel');
    }
  }

  private async executeStream(song: any) {
    this.queue.currentSong = song;
    this.queue.songs.shift();

    if (!song) {
      this.queue.voiceChannel.leave();
      delete this.queue;
      return;
    }

    const stream = YTDL(song.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
    });

    const dispatcher = await this.queue.connection.play(stream, {
      bitrate: 'auto',
      highWaterMark: 1,
    });

    dispatcher.on('error', (e: any) => {
      console.error(e);
      this.queue.connection.dispatcher.end();
    });

    dispatcher.on('finish', () => {
      this.queue.currentSong = {};
      this.executeStream(this.queue.songs[0]);
    });

    const volume = 50;

    dispatcher.setVolumeLogarithmic(volume / 100);
  }

  public async play(message: Message, args: any[]) {
    const query = args.join(' ');
    const ID = await this.getID(query);

    if (YTDL.validateID(ID)) {
      try {
        const songInfo = await YTDL.getInfo(ID);

        const song = {
          title: songInfo.title,
          url: songInfo.video_url,
          requestedBy: message.author.username,
          priority: true,
        };

        if (!this.queue) {
          this.queueConstruct(message, song);
        } else {
          const notPrioritised = this.queue.songs.findIndex((i: any) => i.priority === false);
          notPrioritised >= 0 ? this.queue.songs.splice(notPrioritised, 0, song) : this.queue.songs.push(song);
        }

        return message.channel.send(`${message.author} -> "${song.title}" has added to the queue!`);
      } catch (e) {
        console.error(e);
        return message.channel.send('Something went wrong while fetching data via YTDL');
      }
    } else if (PL.validateURL(`https://www.youtube.com/playlist?list=${ID}`)) {
      try {
        const playlist = await PL(ID, { limit: 0 });

        playlist.items.forEach((item: any) => {
          try {
            if (!YTDL.validateURL(item.url_simple)) return;

            const song = {
              title: item.title,
              url: item.url_simple,
              requestedBy: message.author.username,
              priority: false,
            };

            if (!this.queue) this.queueConstruct(message, song);
            else this.queue.songs.push(song);
          } catch (e) {
            console.error(e);
            message.channel.send(`Something went wrong while fetching data from <${item.url_simple}> via YTDL`);
          }
        });

        return message.channel.send(`${message.author} -> ${playlist.items.length} songs added to the queue!`);
      } catch (e) {
        console.error(e);
        return message.channel.send('Something went wrong while fetching playlist data via YTPL');
      }
    } else {
      return message.channel.send('Could not fetch ID');
    }
  }
}
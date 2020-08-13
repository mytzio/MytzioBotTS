import { Structures, Client, Guild } from 'discord.js';
import MediaPlayer from '../classes/MediaPlayer';

Structures.extend('Guild', Guild => {
  class GuildExtension extends Guild {

    media: {
      player: MediaPlayer,
    };

    constructor (client: Client, data: object) {
      super(client, data);
      this.media = {
        player: new MediaPlayer(),
      };
    }
  }

  return GuildExtension;
});

export default interface GuildExtension extends Guild {
  media: {
    player: MediaPlayer,
  };
}

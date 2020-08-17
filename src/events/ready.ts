import Event from '../base/classes/Event';
import { Client } from 'discord.js';

import defaultRole from '../base/functions/defaultRole';
import presenceUpdater from '../base/functions/presenceUpdater';

import axios from "axios";
axios.defaults;

export default class ReadyEvent extends Event {

  constructor () {
    super('ready');
  }

  public async execute(_client: Client) {
    // Generate an Invitation Link
    try {
      const link = await _client.generateInvite(8);
      console.log('Invite bot to your server by using link below:');
      console.log(link);
    }
    catch (e) {
      console.error(e);
    }

    // Default role assigning
    _client.guilds.cache.forEach(guild => {
      guild.members.cache.forEach(member => {
        defaultRole(member);
      });
    });

    // Set presence
    presenceUpdater(_client);
  }
}
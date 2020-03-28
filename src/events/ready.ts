import Bot from '../client/client';
import { Client } from 'discord.js';

export = class ReadyEvent extends Bot {

  constructor(client: Client) {
    super()
    this.client = client
  }

  public async execute() {
    // Generate an Invitation Link
    try {
      const link = await this.client.generateInvite(8);
      console.log('Invite bot to your server by using link below:');
      console.log(link);
    }
    catch (e) {
      console.error(e);
    }
  }
}
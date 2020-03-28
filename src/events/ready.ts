import Bot from '../client/client';
import { Client } from 'discord.js';
import Bot from '../client/client';

export = class ReadyEvent extends Bot {

  constructor(client: Client) {
<<<<<<< HEAD
    super()
=======
    super();
>>>>>>> b347a15a1fdd1ca570f2097340a88ab07762c004
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
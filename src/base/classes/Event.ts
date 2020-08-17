import { Client } from 'discord.js';

export default class Event {

  public client: any;
  public name: string;

  constructor (client: Client, name = 'raw') {
    this.client = client;
    this.name = name;
  }
}
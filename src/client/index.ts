import { Client, Collection } from "discord.js";
import { readdirSync, lstatSync } from "fs";
import path from "path";

import '../base/structures/Guild';

export default class Bot {

  public client: Client;

  constructor () {
    this.client = new Client({ disableMentions: "everyone" });
  }

  static commands = new Collection();

  public async init() {

    const loadFiles = async (directory: string) => {
      const files = readdirSync(path.join(__dirname, directory));
      for await (const file of files) {
        const stat = lstatSync(path.join(__dirname, directory, file));
        if (stat.isDirectory()) {
          loadFiles(path.join(directory, file));
        } else {
          const importFile = await import(path.join(__dirname, directory, file));
          const instantce = new importFile.default(this.client);

          if (instantce.event) {
            this.client.on(instantce.event, (...args) => instantce.execute(this.client, ...args));
          } else {
            Bot.commands.set(instantce.help.name, instantce);
          }
        }
      }
    };

    loadFiles('../commands');
    loadFiles('../events');

    /*
      Bot login
    */

    try {
      await this.client.login(process.env.DISCORD_API_TOKEN);
      console.log(`Client login as ${this.client.user!.tag}`);
    } catch (e) {
      console.error(e);
    }
  }
}

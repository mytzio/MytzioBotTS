import { Client, Collection } from "discord.js";
import { readdirSync, lstatSync } from "fs";
import path from "path";
import Logger from "../base/classes/Logger";

import '../base/structures/Guild';

export default class Bot {
  public client: Client;

  constructor () {
    this.client = new Client({ disableMentions: "everyone" });
    this.client.commands = new Collection();
    this.client.logger = new Logger();
  }

  public async init() {

    // Register a command and an event files
    const registerFiles = async (dir: string, type: 'command' | 'event') => {
      // Read the directory / file
      let files = readdirSync(path.join(__dirname, dir));

      // Loop through each file
      for (let file of files) {
        let stat = lstatSync(path.join(__dirname, dir, file));

        if (stat.isDirectory()) {
          // If directory, start loop from begining
          registerFiles(path.join(dir, file), type);
        } else {
          // Import and call a file
          let fileImporter = await import(path.join(__dirname, dir, file));
          let fileClass = new fileImporter.default(this.client);

          // Assign as a command or an event, depending what the type is
          if (type === 'command') {
            this.client.commands.set(fileClass.help.name, fileClass);
          } else {
            this.client.on(fileClass.name, (...args: any) => fileClass.execute(this.client, ...args));
          }
        }
      }
    };

    registerFiles('../commands', 'command');
    registerFiles('../events', 'event');

    /*
			Bot login
		*/

    try {
      await this.client.login(process.env.DISCORD_API_TOKEN);
      this.client.logger.log(`Client login as ${this.client.user!.tag}`);
    } catch (e) {
      this.client.logger.error(e);
    }
  }
}

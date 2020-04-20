import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

export default class Bot {

	public client: Client;

	constructor() {
		this.client = new Client({ disableMentions: 'everyone' });
		this.client.commands = new Collection();
	}

	public async init(token: string) {

		/*
			Load commands
		*/

		const commandDir = `${__dirname}/../commands`;
		const categories = readdirSync(commandDir);

		for (const category of categories) {
			const categoryPath = path.resolve(`${commandDir}/${category}/`);
			const commandFiles = readdirSync(categoryPath);

			for (const file of commandFiles) {
				try {
					const commandImporter = await import(`${commandDir}/${category}/${file}`);
					const command = new commandImporter.default(this.client);
					
					this.client.commands.set(command.help.name, command);
					command.help.category = category;
				} catch (e) {
					console.error(`Could not load ${file} command` + e);
				}
			}
		}
		
		/*
			Load events
		*/

		const eventDir = `${__dirname}/../events`;
		const eventFiles = readdirSync(eventDir);

		for (const file of eventFiles) {
			const eventName: any = file.split('.')[0];
			
			try {
				const eventImporter = await import(`${eventDir}/${file}`);
				const event = new eventImporter.default(this.client);
				
				this.client.on(eventName, (...args: any) => event.execute(...args));
			} catch (e) {
				console.error(`Could not load ${eventName} event!\n` + e);
			}
		}

		/*
			Bot login
		*/

		try {
			await this.client.login(token);
			console.log(`Client login as ${this.client.user!.tag}`);
		}
		catch (e) {
			console.error(e);
		}
	}
}
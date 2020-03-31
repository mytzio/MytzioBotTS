import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

export default class Bot extends Client {

	public client: Client;
	public commands: Collection<unknown, unknown>;

	constructor() {
		super();
		this.client = new Client({ disableMentions: 'everyone' });
		this.commands = new Collection();
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
					const command = new (require(`${commandDir}/${category}/${file}`))(this.client);
					
					this.commands.set(command.help.name, command);
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
			const eventName = file.split('.')[0];
			
			try {
				const event = new (require(`${eventDir}/${file}`))(this.client, this.commands);
				this.client.on(eventName, (...args: any) => event.execute(...args));
				delete require.cache[require.resolve(`${eventDir}/${file}`)];
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
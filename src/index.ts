import Bot from "./client";
import dotenv from 'dotenv';
dotenv.config();

const client = new Bot();
client.init(process.env.DISCORD_API_TOKEN!);

process.once('SIGINT', () => {
  process.exit(0);
});


import Bot from "./client";
import dotenv from 'dotenv';
dotenv.config();

const client = new Bot();

client.init();

process.once('SIGINT', () => {
  process.exit(0);
});


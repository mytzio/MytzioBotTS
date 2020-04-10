import Bot from '../client/client';
import { Client } from 'discord.js';
import dayjs from "dayjs";

import axios from "axios";
axios.defaults;

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

    // Corona statistics activity
    try {
      const activity = async () => {
      const a = await axios.get('https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2');

      const c = a.data.confirmed;
      const d = a.data.deaths;

      const estimate = (items: any[]) => {
        const timeNow = dayjs();
  
        let counter = 0;
        items.forEach(item => {
          const timeInCase = dayjs(item.date);
          const daysDifference = timeInCase.diff(timeNow, 'day');
  
          if (daysDifference < -13 ) counter++;
          else return;
        })
  
        return counter;
      }
  
      const estimateRecovered = estimate(c) - d.length;

      this.client.user?.setPresence({
        activity: {
          name: `C:${c.length}, D:${d.length}, R:${estimateRecovered}`,
          type: 'WATCHING',
          url: 'https://github.com/HS-Datadesk/koronavirus-avoindata'
        }
      })
    }

    activity();
    setInterval(activity, 600000);
    } catch (e) {
      console.error(e);
    }
  }
}
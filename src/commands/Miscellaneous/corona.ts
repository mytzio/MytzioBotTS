import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/Command';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

import axios from "axios";
axios.defaults;

export = class Corona extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'corona',
      description: 'Show statistics about COVID-19 in Finland',
      aliases: ['c', 'korona'],
    })
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    const url = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';

    try {
      const response = await axios.get(url);

      const confirmed = response.data.confirmed;
		  const deaths = response.data.deaths;
		  const recovered = response.data.recovered;

      const estimate = (items: any[]) => {
        const timeNow = dayjs();

        let counter = 0;
        items.forEach(item => {
          const timeInCase = dayjs(item.date);
          const daysDifference = timeInCase.diff(timeNow, 'day');

          if (daysDifference < -13 ) counter++;
        })

        return counter;
      }

      const estimateConfirmed = confirmed.length - deaths.length - estimate(confirmed);
      const estimateRecovered = estimate(confirmed) - deaths.length;

      const date = (time: string) => {
        return dayjs(time).locale('fi').format('L');
      }

      const district = (district: string | null) => {
        return (!district || district.length < 1) ? 'unknown' : district;
      }

      const lastCase = (items: any[]) => {
        let lastItem = items.slice(-1)[0];

        lastItem.date = date(lastItem.date);
        lastItem.healthCareDistrict = district(lastItem.healthCareDistrict);
        return `**${lastItem.healthCareDistrict}**\n*${lastItem.date}*` || '-';
      }

      const embed = new MessageEmbed()
        .setTitle('Corona in Finland')
        .setDescription('Statistics about COVID-19 in Finland')
        .addField('Confirmed', `${confirmed.length} (~${estimateConfirmed})`, true)
        .addField('Deaths', `${deaths.length}`, true)
        .addField('Recovered', `${recovered.length} (~${estimateRecovered})`, true)
        .addField('\u200B', '\u200B')
        .addField('Last Confirmed', lastCase(confirmed), true)
        .addField('Last Death', lastCase(deaths), true)
        .addField('Last Recovered', lastCase(recovered), true)
        .setFooter(`Replying to ${_message.author.tag} - Sources: https://github.com/HS-Datadesk/koronavirus-avoindata`);
        
      _message.channel.send(embed);

      const activity = async () => {
        const a = await axios.get(url);

			  const c = a.data.confirmed;
			  const d = a.data.deaths;
			  const r = a.data.recovered;

			  _client.user?.setActivity(`C: ${c.length}, D: ${d.length}, R: ${r.length}`, { type: 'WATCHING' });
      }

      activity();
		  setInterval(activity, 300000);
    } catch (e) {
      console.error(e);
    }
  }
}
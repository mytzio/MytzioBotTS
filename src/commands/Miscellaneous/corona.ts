import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/Command';
import _ from 'lodash';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

import axios from "axios";
axios.defaults;

export default class Corona extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'corona',
      description: 'Show statistics about COVID-19 in Finland',
      aliases: ['c', 'korona'],
    });
  }

  public async execute(_client: Client, _message: Message, _args: string[]) {
    const defaultUrl = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2';
    const hospitalisedUrl = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaHospitalData';

    const response = await axios.get(defaultUrl);

    const confirmed = response.data.confirmed;
    const deaths = response.data.deaths;

    const estimate = (items: any[]) => {
      const timeNow = dayjs();

      let counter = 0;
      items.forEach(item => {
        const timeInCase = dayjs(item.date);
        const daysDifference = timeInCase.diff(timeNow, 'day');

        if (daysDifference < -13) counter++;
        else return;
      });

      return counter;
    };

    const estimateRecovered = estimate(confirmed) - deaths.length;

    const embed = new MessageEmbed()
      .setTitle('Corona in Finland')
      .setDescription('Statistics about COVID-19 in Finland')
      .addField('Confirmed', `${confirmed.length}`, true)
      .addField('Deaths', `${deaths.length}`, true)
      .addField('Recovered', `~${estimateRecovered}`, true)
      .setFooter(`Replying to ${_message.author.tag} - Sources: https://github.com/HS-Datadesk/koronavirus-avoindata`);

    /*
      Hospitalised Row
    */
    const response2 = await axios.get(hospitalisedUrl);
    const hospitalised = response2.data.hospitalised.reverse();

    let counter = 0;
    while (hospitalised[counter].area !== 'Finland' || counter > 20) counter++;

    if (hospitalised[counter].area === 'Finland') {
      embed.addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Hospitalised', value: hospitalised[counter].totalHospitalised || '-', inline: true, },
        { name: 'In Ward', value: hospitalised[counter].inWard || '-', inline: true, },
        { name: 'In Intensive Care', value: hospitalised[counter].inIcu || '-', inline: true, },
      );
    }

    /*
     * Areas
     */
    const disctrictsGrouped = _.groupBy(confirmed, district => district.healthCareDistrict);
    const sortedDescending = _.sortBy(disctrictsGrouped, district => district.length).reverse();

    let areas = '';
    sortedDescending.forEach((area: any) => {
      areas += `**(${area.length})** *${area[0].healthCareDistrict}*\n`;
    });


    embed.addField('Infected Areas', areas);

    _message.channel.send(embed);
  }
}
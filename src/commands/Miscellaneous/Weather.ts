import { Client, Message, MessageEmbed } from "discord.js";
import Command from '../../base/Command';
import axios from 'axios';

export default class Weather extends Command {
  constructor (client: Client) {
    super(client, {
      name: 'weather',
      description: 'Get weather by location',
      aliases: ['w'],
    });
  }

  public async execute(_client: Client, _message: Message, _args: [string]) {
    if (_args.length < 1) return _message.channel.send('Please provide a location');

    const location = _args.join(' ');

    const getCurrentWeather = await axios.get('http://api.openweathermap.org/data/2.5/find', {
      params: {
        APPID: process.env.OPENWEATHER_API_KEY,
        q: location,
        units: 'metric',
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const currentWeather = getCurrentWeather.data.list[0];

    if (!currentWeather) return _message.channel.send('Could not find that location');

    const getForecasts = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
      params: {
        APPID: process.env.OPENWEATHER_API_KEY,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon,
        exclude: 'minutely,hourly',
        units: 'metric',
      },
      headers: {
        Accept: 'application/json',
      },
    });

    const dailyForecasts = getForecasts.data.daily;

    const getCardinalDirection = (angle: number) => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[Math.round(angle / 45) % 8];
    };

    const embed = new MessageEmbed()
      .setAuthor('OpenWeather', 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/icons/logo_60x60.png', 'https://openweathermap.org/')
      .setTitle(`${currentWeather.name}, ${currentWeather.sys.country}`)
      .setDescription(`Feels like ${currentWeather.main.feels_like.toFixed(0)}°C. ${currentWeather.weather[0].description.charAt(0).toUpperCase() + currentWeather.weather[0].description.slice(1)}.`)
      .setColor('ORANGE')
      .setThumbnail(`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`)
      .setURL(`https://openweathermap.org/city/${currentWeather.id}`)

      .addFields(
        { name: 'Temperature', value: `${currentWeather.main.temp}°C`, inline: true },
        { name: 'Pressure', value: `${currentWeather.main.pressure}hPa`, inline: true },
        { name: 'Humidity', value: `${currentWeather.main.humidity}%`, inline: true },

        { name: 'Wind', value: `${currentWeather.wind.speed}m/s ${getCardinalDirection(currentWeather.wind.deg)}`, inline: true },
        { name: 'Clouds', value: `${currentWeather.clouds.all}%`, inline: true },
        { name: 'Rain/Snow (1h)', value: `${currentWeather.snow ? currentWeather.rain['1h'] : 0} / ${currentWeather.snow ? currentWeather.snow['1h'] : 0}mm`, inline: true },
        { name: '\u200B', value: '\u200B' },

        {
          name: 'Today', value: `${Math.round(dailyForecasts[0].temp.day)} / ${Math.round(dailyForecasts[0].temp.night)}°C\n
          ${dailyForecasts[0].weather[0].main} (${dailyForecasts[0].weather[0].description})`, inline: true
        },
        {
          name: 'Tomorrow', value: `${Math.round(dailyForecasts[1].temp.day)} / ${Math.round(dailyForecasts[1].temp.night)}°C\n
          ${dailyForecasts[1].weather[0].main} (${dailyForecasts[1].weather[0].description})`, inline: true
        },
        {
          name: 'The Next Day', value: `${Math.round(dailyForecasts[2].temp.day)} / ${Math.round(dailyForecasts[2].temp.night)}°C\n
          ${dailyForecasts[2].weather[0].main} (${dailyForecasts[2].weather[0].description})`, inline: true
        },
      );

    return _message.channel.send(embed);
  }
}
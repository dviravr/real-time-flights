import axios from 'axios';
import { config } from 'real-time-flight-lib';
import { sendLog, ServicesEnum } from './logger.service';

export const getWeatherAtCity = async (city: string): Promise<string> => {
  sendLog(ServicesEnum.WEATHER);
  try {
    const res = await axios.get(config.WEATHER_URL, {
      params: {
        key: '8d07f757a89749c0a63194247220809',
        q: city,
      },
    });
    return res.data.current.condition.text;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

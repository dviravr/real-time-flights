import axios from 'axios';
import { config } from 'real-time-flight-lib';
import { sendLog, ServicesEnum } from './logger.service';

export const getWeatherAtCity = async (city: string): Promise<string> => {
  sendLog(ServicesEnum.WEATHER);
  try {
    const res = await axios.get(config.WEATHER_URL, {
      params: {
        key: config.WEATHER_API_KEY,
        q: city,
      },
    });
    return res.data.current.condition.text;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

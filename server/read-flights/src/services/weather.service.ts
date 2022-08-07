import axios from 'axios';
import { config } from '../config';

const getTlvWeather = async () => {
  try {
    const res = await axios.get(config.FLIGHT_RADAR_24_URL, {
      params: {
        'code': config.TLV_AIRPORT_CODE,
        'token': config.FLIGHT_RADAR_24_TOKEN,
      },
    });
    return res.data.result.response.airport.pluginData.weather;
  } catch (err) {
    console.log(err);
  }
};

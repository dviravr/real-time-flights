import axios from 'axios';
import { AirportMetadata, config, FlightsTypes } from 'real-time-flight-lib';
import { sendLog, ServicesEnum } from './logger.service';

export const getFlightFullDetails = (flightId: string) => {
  sendLog(ServicesEnum.FLIGHT_RADAR);
  return axios.get(config.FLIGHT_RADAR_SINGLE_FLIGHT_URL, {
    params: {
      version: '1.5',
      flight: flightId,
    },
  }).catch((err) => {
    console.log(err);
    return { data: 'error' };
  });
};

export const tlvDetails: AirportMetadata = {
  airport: 'TLV',
  city: 'Tel Aviv',
  country: 'Israel',
  weather: null,
};

export const tlvLocation = {
  lat: 32.011379,
  lon: 34.886662,
};

export const getAllFlightsByType = async (whatToRequest: FlightsTypes, page: number = 1) => {
  const firstPage = await getFlightsRequest(whatToRequest, page);
  if (firstPage) {
    const totalPages: number = firstPage.page.total;
    const nextPage: number = firstPage.page.current + 1;
    let apiFlights: any[] = firstPage.data;
    for (let i = nextPage; i <= totalPages; i++) {
      apiFlights = apiFlights.concat((await getFlightsRequest(whatToRequest, i))?.data);
    }

    return apiFlights;
  }
};

const getFlightsRequest = async (whatToRequest: FlightsTypes, page: number = 1) => {
  sendLog(ServicesEnum.FLIGHT_RADAR);
  try {
    const res = await axios.get(config.FLIGHT_RADAR_24_URL, {
      params: {
        'plugin-setting[schedule][mode]': whatToRequest,
        'code': config.TLV_AIRPORT_CODE,
        'token': config.FLIGHT_RADAR_24_TOKEN,
        // 'plugin-setting[schedule][timestamp]': 1660986000,
        page,
      },
    });
    return res.data.result.response.airport.pluginData.schedule[whatToRequest];
  } catch (err) {
    console.log(err);
  }
};

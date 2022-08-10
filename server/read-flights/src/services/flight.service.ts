import axios from 'axios';
import { config } from '../config';
import { FlightsTypes } from '../model/flight.model';

export const getFlightFullDetails = (flightId: string) => {
  return axios.get(config.FLIGHT_RADAR_SINGLE_FLIGHT_URL, {
    params: {
      version: '1.5',
      flight: flightId,
    },
  }).catch((err) => console.log(err));
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
  try {
    const res = await axios.get(config.FLIGHT_RADAR_24_URL, {
      params: {
        'plugin-setting[schedule][mode]': whatToRequest,
        'code': config.TLV_AIRPORT_CODE,
        'token': config.FLIGHT_RADAR_24_TOKEN,
        page,
      },
    });
    return res.data.result.response.airport.pluginData.schedule[whatToRequest];
  } catch (err) {
    console.log(err);
  }
};
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { getWeatherAtCity } from './weather.service';
import { getAllFlightsByType } from './flight.service';
import { getGeoDistance } from '../utils/geo.utils';
import { Message } from 'kafkajs';
import { producer } from '../index';
import moment from 'moment';

const modelHistoricalFlights = async (apiFlights: any[], isArrival: boolean): Promise<Flight[]> => {
  const tlvWeather = await getWeatherAtCity(config.TLV_DETAILS.city);
  const flights: Flight[] = [];
  apiFlights = apiFlights
      .filter((apiFlight) => apiFlight?.flight?.time.real.departure && apiFlight?.flight?.time.real.arrival);

  for (const apiFlight of apiFlights) {
    const anotherCity = {
      airport: apiFlight?.flight?.airport[isArrival ? 'origin' : 'destination'].code.iata,
      city: apiFlight?.flight?.airport[isArrival ? 'origin' : 'destination'].position.region.city,
      country: apiFlight?.flight?.airport[isArrival ? 'origin' : 'destination'].position.country.name,
    };

    const anotherWeather = await getWeatherAtCity(anotherCity.city);
    flights.push({
      id: apiFlight?.flight?.identification.id,
      callSign: apiFlight?.flight?.identification.callsign,
      airline: apiFlight?.flight?.airline?.name,
      origin: isArrival ? {
        ...anotherCity,
        weather: anotherWeather,
      } : {
        ...config.TLV_DETAILS,
        weather: tlvWeather,
      },
      destination: isArrival ? {
        ...config.TLV_DETAILS,
        weather: tlvWeather,
      } : {
        ...anotherCity,
        weather: anotherWeather,
      },
      actualTime: {
        departureTime: apiFlight?.flight?.time.real.departure,
        arrivalTime: apiFlight?.flight?.time.real.arrival,
      },
      scheduledTime: {
        departureTime: apiFlight?.flight?.time.scheduled.departure,
        arrivalTime: apiFlight?.flight?.time.scheduled.arrival,
      },
      distance: getGeoDistance(config.TLV_LOCATION,
          {
            lat: apiFlight?.flight?.airport[isArrival ? 'origin' : 'destination'].position.latitude,
            lon: apiFlight?.flight?.airport[isArrival ? 'origin' : 'destination'].position.longitude,
          },
      ),
    });
  }

  return flights;
};

const getHistoricalFlights = async () => {
  const timeToCheck = moment().subtract(1, 'd').unix();
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS, 1, timeToCheck),
    getAllFlightsByType(FlightsTypes.DEPARTURES, 1, timeToCheck),
  ]);


  const [arrivals, departures] = await Promise.all([
    modelHistoricalFlights(arrivalsApi, true),
    modelHistoricalFlights(departuresApi, false),
  ]);

  return {
    arrivals,
    departures,
  };
};


export const sendHistoricalFlights = () => {
  getHistoricalFlights().then(({ arrivals, departures }) => {
    const messages: Message[] = [];

    arrivals.forEach((flight) => {
      messages.push({
        value: JSON.stringify(flight),
      });
    });
    departures.forEach((flight) => {
      messages.push({
        value: JSON.stringify(flight),
      });
    });

    producer.sendMessages(messages, config.CLOUDKARAFKA_TOPIC_HISTORICAL);
  });
};

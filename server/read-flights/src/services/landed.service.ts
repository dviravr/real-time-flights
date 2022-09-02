import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { getWeatherAtCity } from './weather.service';
import { getAllFlightsByType, tlvDetails, tlvLocation } from './flight.service';
import { getGeoDistance } from '../utils/geo.utils';
import { Message } from 'kafkajs';
import { producer } from '../index';
import moment from 'moment';

const modelHistoricalFlights = async (apiFlights: any[], type: FlightsTypes): Promise<Flight[]> => {
  const flights: Flight[] = [];
  apiFlights = apiFlights
      .filter((apiFlight) => apiFlight?.flight?.time.real.departure && apiFlight?.flight?.time.real.arrival);
  for (const apiFlight of apiFlights) {
    const [tlvWeather, anotherWeather] = await Promise.all([
      getWeatherAtCity(tlvDetails.city),
      getWeatherAtCity(type === FlightsTypes.ARRIVALS ?
          apiFlight?.flight?.airport.origin.position.region.city :
          apiFlight?.flight?.airport.destination.position.region.city),
    ]);
    flights.push({
      id: apiFlight?.flight?.identification.id,
      callSign: apiFlight?.flight?.identification.callsign,
      airline: apiFlight?.flight?.airline?.name,
      origin: type === FlightsTypes.DEPARTURES ? {
        ...tlvDetails,
        weather: tlvWeather,
      } : {
        airport: apiFlight?.flight?.airport.origin.code.iata,
        city: apiFlight?.flight?.airport.origin.position.region.city,
        country: apiFlight?.flight?.airport.origin.position.country.name,
        weather: anotherWeather,
      },
      destination: type === FlightsTypes.ARRIVALS ? {
        ...tlvDetails,
        weather: tlvWeather,
      } : {
        airport: apiFlight?.flight?.airport.destination.code.iata,
        city: apiFlight?.flight?.airport.destination.position.region.city,
        country: apiFlight?.flight?.airport.destination.position.country.name,
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
      distance: getGeoDistance(
          type === FlightsTypes.DEPARTURES ? tlvLocation : {
            lat: apiFlight?.flight?.airport.origin.position.latitude,
            lon: apiFlight?.flight?.airport.origin.position.longitude,
          },
          type === FlightsTypes.ARRIVALS ? tlvLocation : {
            lat: apiFlight?.flight?.airport.destination.position.latitude,
            lon: apiFlight?.flight?.airport.destination.position.longitude,
          },
      ),
    });
  }

  return flights;
};

export const sendHistoricalFlights = async () => {
  const timeToCheck = moment().subtract(1, 'd').unix();
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS, 1, timeToCheck),
    getAllFlightsByType(FlightsTypes.DEPARTURES, 1, timeToCheck),
  ]);

  const [arrivals, departures] = await Promise.all([
    modelHistoricalFlights(arrivalsApi, FlightsTypes.ARRIVALS),
    modelHistoricalFlights(departuresApi, FlightsTypes.DEPARTURES),
  ]);
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
};

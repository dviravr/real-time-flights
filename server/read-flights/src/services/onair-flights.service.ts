import { getGeoDistance } from '../utils/geo.utils';
import { getAllFlightsByType, getFlightFullDetails } from './flight.service';
import { keyBy } from 'lodash';
import { producer } from '../index';
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { Message } from 'kafkajs';

const modelOnlineFlights = async (apiFlights: any[]): Promise<Flight[]> => {
  const flights: Flight[] = [];
  const flightsFullDetailsPromise = [];
  apiFlights?.filter((apiFlight) => apiFlight.flight.status?.live && apiFlight.flight.identification.id)
      .map((apiFlight) => apiFlight.flight.identification.id)
      .forEach((flightId) => {
        flightsFullDetailsPromise.push(getFlightFullDetails(flightId));
      });
  const flightsFullDetails = await Promise.all(flightsFullDetailsPromise);
  flightsFullDetails.filter((apiFlights) => apiFlights).forEach((apiFlight) => {
    flights.push({
      id: apiFlight.data.identification.id,
      callSign: apiFlight.data.identification.callsign,
      airline: apiFlight.data.airline.name,
      origin: {
        airport: apiFlight.data.airport.origin.code.iata,
        city: apiFlight.data.airport.origin.position.region.city,
        country: apiFlight.data.airport.origin.position.country.name,
        weather: null,
      },
      destination: {
        airport: apiFlight.data.airport.destination.code.iata,
        city: apiFlight.data.airport.destination.position.region.city,
        country: apiFlight.data.airport.destination.position.country.name,
        weather: null,
      },
      actualTime: {
        departureTime: apiFlight.data.time.real.departure,
        arrivalTime: apiFlight.data.time.real.arrival,
      },
      scheduledTime: {
        departureTime: apiFlight.data.time.scheduled.departure,
        arrivalTime: apiFlight.data.time.scheduled.arrival,
      },
      distance: getGeoDistance(
          {
            lat: apiFlight.data.airport.origin.position.latitude,
            lon: apiFlight.data.airport.origin.position.longitude,
          },
          {
            lat: apiFlight.data.airport.destination.position.latitude,
            lon: apiFlight.data.airport.destination.position.longitude,
          },
      ),
      trail: apiFlight.data.trail.map((location) => ({
        latitude: location.lat,
        longitude: location.lng,
        altitude: location.alt,
        speed: location.spd,
        head: location.hd,
      })),
    });
  });

  return flights;
};

const getOnAirFlights = async () => {
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS),
    getAllFlightsByType(FlightsTypes.DEPARTURES, -1),
  ]);

  const [arrivals, departures] = await Promise.all([
    modelOnlineFlights(arrivalsApi),
    modelOnlineFlights(departuresApi),
  ]);

  return {
    arrivals: keyBy(arrivals, 'id'),
    departures: keyBy(departures, 'id'),
  };
};

export const sendOnAirFlights = () => {
  console.log('interval');
  getOnAirFlights().then(({ arrivals, departures }) => {
    const messages: Message[] = [
      {
        key: FlightsTypes.ARRIVALS,
        value: JSON.stringify(arrivals),
      },
      {
        key: FlightsTypes.DEPARTURES,
        value: JSON.stringify(departures),
      },
    ];
    producer.sendMessages(messages, config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS);
  }).catch((err) => {
    console.log(err);
  });
};

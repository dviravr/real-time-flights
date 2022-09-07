import { getAllFlightsByType, getFlightFullDetails } from './flight.service';
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import moment from 'moment';
import { getGeoDistance } from '../utils/geo.utils';
import { getWeatherAtCity } from './weather.service';
import { Message } from 'kafkajs';
import { producer } from '../index';

const modelToBeDeparturesFlights = async (apiFlights: any[], minutesRange: number): Promise<Flight[]> => {
  const timeToCompare = moment().add(minutesRange, 'minutes').unix();
  const threeHoursAgo = moment().subtract(3, 'hours').unix();

  const flightsFullDetailsPromise = [];
  apiFlights?.filter((apiFlight) => apiFlight?.flight?.identification?.id)
      .map((apiFlight) => apiFlight.flight.identification.id)
      .forEach((flightId) => {
        flightsFullDetailsPromise.push(getFlightFullDetails(flightId));
      });
  const flightsFullDetails = (await Promise.all(flightsFullDetailsPromise))
      .filter((apiFlight) => !apiFlight.data.status?.live &&
          !apiFlight.data.time.real.departure &&
          apiFlight.data.time.scheduled.departure < timeToCompare &&
          apiFlight.data.time.scheduled.departure > threeHoursAgo);

  const flights: Flight[] = [];

  for (const apiFlight of flightsFullDetails) {
    flights.push({
      id: apiFlight.data.identification.id,
      callSign: apiFlight.data.identification.callsign,
      airline: apiFlight.data.airline.name,
      origin: {
        ...config.TLV_DETAILS,
        weather: await getWeatherAtCity(config.TLV_DETAILS.city),
      },
      destination: {
        airport: apiFlight.data.airport.destination.code.iata,
        city: apiFlight.data.airport.destination.position.region.city,
        country: apiFlight.data.airport.destination.position.country.name,
        weather: await getWeatherAtCity(apiFlight.data.airport.destination.position.region.city),
      },
      scheduledTime: {
        departureTime: apiFlight.data.time.scheduled.departure,
        arrivalTime: apiFlight.data.time.scheduled.arrival,
      },
      distance: getGeoDistance(config.TLV_LOCATION, {
        lat: apiFlight?.data?.airport.destination.position.latitude,
        lon: apiFlight?.data?.airport.destination.position.longitude,
      }),
    });
  }

  return flights;
};

const getNext15MinutesDepartures = async () => {
  const apiDepartures = await getAllFlightsByType(FlightsTypes.DEPARTURES, -1);
  return modelToBeDeparturesFlights(apiDepartures, 15);
};

export const sendGoingToDepartureFlights = () => {
  getNext15MinutesDepartures().then((flights) => {
    const messages: Message[] = [];
    flights.forEach((flight) => {
      messages.push({
        key: flight.id,
        value: JSON.stringify(flight),
      });
    });
    messages.push({
      key: 'takeoff',
      value: JSON.stringify(flights.map((flight) => flight.id)),
    });
    producer.sendMessages(messages, config.CLOUDKARAFKA_TOPIC_TAKE_OFF);
  }).catch((err) => {
    console.log(err);
  });
};

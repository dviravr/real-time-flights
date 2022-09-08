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
  const tlvWeather = await getWeatherAtCity(config.TLV_DETAILS.city);
  const flights: Flight[] = [];

  apiFlights = apiFlights?.filter((apiFlight) =>
    apiFlight?.flight?.identification?.id &&
      !apiFlight.flight.status?.live &&
      !apiFlight.flight?.time?.real.departure);

  for (const apiFlight of apiFlights) {
    const flight = await getFlightFullDetails(apiFlight.flight.identification.id);

    if (!flight.data.status?.live &&
        !flight.data?.time?.real.departure &&
        flight.data?.time?.scheduled.departure < timeToCompare &&
        flight.data?.time?.scheduled.departure > threeHoursAgo) {
      const anotherWeather = await getWeatherAtCity(flight.data.airport.destination.position.region.city);
      flights.push({
        id: flight.data.identification.id,
        callSign: flight.data.identification.callsign,
        airline: flight.data.airline.name,
        origin: {
          ...config.TLV_DETAILS,
          weather: tlvWeather,
        },
        destination: {
          airport: flight.data.airport.destination.code.iata,
          city: flight.data.airport.destination.position.region.city,
          country: flight.data.airport.destination.position.country.name,
          weather: anotherWeather,
        },
        scheduledTime: {
          departureTime: flight.data.time.scheduled.departure,
          arrivalTime: flight.data.time.scheduled.arrival,
        },
        distance: getGeoDistance(config.TLV_LOCATION, {
          lat: flight?.data?.airport.destination.position.latitude,
          lon: flight?.data?.airport.destination.position.longitude,
        }),
      });
    }
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

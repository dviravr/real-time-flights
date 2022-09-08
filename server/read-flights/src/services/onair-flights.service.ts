import { getGeoDistance } from '../utils/geo.utils';
import { getAllFlightsByType, getFlightFullDetails } from './flight.service';
import { keyBy } from 'lodash';
import { producer } from '../index';
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { Message } from 'kafkajs';
import { getWeatherAtCity } from './weather.service';

const modelOnairFlights = async (apiFlights: any[], isArrival: boolean): Promise<Flight[]> => {
  const tlvWeather = await getWeatherAtCity(config.TLV_DETAILS.city);
  const flights: Flight[] = [];
  apiFlights = apiFlights?.filter((apiFlight) => apiFlight?.flight?.identification?.id && apiFlight?.flight?.status?.live);

  for (const apiFlight of apiFlights) {
    const flight = await getFlightFullDetails(apiFlight.flight.identification.id);
    if (flight?.data?.status?.live) {
      const anotherWeather = await getWeatherAtCity(
          flight.data.airport[isArrival ? 'origin' : 'destination'].position.region.city);

      flights.push({
        id: flight?.data?.identification.id,
        callSign: flight?.data?.identification.callsign,
        airline: flight?.data?.airline?.name,
        origin: {
          airport: flight?.data?.airport?.origin?.code.iata,
          city: flight?.data?.airport?.origin?.position.region.city,
          country: flight?.data?.airport?.origin.position.country.name,
          weather: isArrival ? anotherWeather : tlvWeather,
        },
        destination: {
          airport: flight?.data?.airport?.destination?.code.iata,
          city: flight?.data?.airport?.destination?.position.region.city,
          country: flight?.data?.airport?.destination?.position.country.name,
          weather: isArrival ? tlvWeather : anotherWeather,
        },
        actualTime: {
          departureTime: flight?.data?.time?.real.departure,
          arrivalTime: flight?.data?.time?.real.arrival,
        },
        scheduledTime: {
          departureTime: flight?.data?.time?.scheduled.departure,
          arrivalTime: flight?.data?.time?.scheduled.arrival,
        },
        distance: getGeoDistance(
            {
              lat: flight?.data?.airport?.origin?.position.latitude,
              lon: flight?.data?.airport?.origin?.position.longitude,
            },
            {
              lat: flight?.data?.airport?.destination?.position.latitude,
              lon: flight?.data?.airport?.destination?.position.longitude,
            },
        ),
        trail: flight?.data?.trail.map((location) => ({
          latitude: location.lat,
          longitude: location.lng,
          altitude: location.alt,
          speed: location.spd,
          head: location.hd,
        })),
      });
    }
  }

  return flights;
};

const getOnAirFlights = async () => {
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS),
    getAllFlightsByType(FlightsTypes.DEPARTURES, -1),
  ]);

  const [arrivals, departures] = await Promise.all([
    modelOnairFlights(arrivalsApi, true),
    modelOnairFlights(departuresApi, false),
  ]);

  return {
    arrivals: keyBy(arrivals, 'id'),
    departures: keyBy(departures, 'id'),
  };
};

export const sendOnAirFlights = () => {
  getOnAirFlights().then(({ arrivals, departures }) => {
    let messages: Message[] = [
      {
        key: FlightsTypes.ARRIVALS,
        value: JSON.stringify(Object.keys(arrivals)),
      },
      {
        key: FlightsTypes.DEPARTURES,
        value: JSON.stringify(Object.keys(departures)),
      },
    ];
    messages = messages
        .concat(
            Object.keys(arrivals).map((flight) => ({
              key: flight,
              value: JSON.stringify(arrivals[flight]),
            })),
            Object.keys(departures).map((flight) => ({
              key: flight,
              value: JSON.stringify(departures[flight]),
            })),
        );
    producer.sendMessages(messages, config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS);
  }).catch((err) => {
    console.log(err);
  });
};

import { getAllFlightsByType, getFlightFullDetails, tlvDetails, tlvLocation } from './flight.service';
import { producer } from '../index';
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { getGeoDistance } from '../utils/geo.utils';
import { Message } from 'kafkajs';
import { getWeatherAtCity } from './weather.service';

export const justLandedFlights = (justLandedFlights: string[]) => {
  const messages: Message[] = [];
  for (const justLandedFlight of justLandedFlights) {
    getFlightFullDetails(justLandedFlight).then(async (apiFlight) => {
      const [originWeather, destinationWeather] = await Promise.all([
        getWeatherAtCity(apiFlight?.data?.airport.origin.position.region.city),
        getWeatherAtCity(apiFlight?.data?.airport.destination.position.region.city),
      ]);
      if (apiFlight.data?.time?.real?.departure &&
          apiFlight.data?.time?.real?.arrival) {
        const flight: Flight = {
          id: apiFlight.data.identification.id,
          callSign: apiFlight.data.identification.callsign,
          airline: apiFlight.data.airline.name,
          origin: {
            airport: apiFlight.data.airport.origin.code.iata,
            city: apiFlight.data.airport.origin.position.region.city,
            country: apiFlight.data.airport.origin.position.country.name,
            weather: originWeather,
          },
          destination: {
            airport: apiFlight.data.airport.destination.code.iata,
            city: apiFlight.data.airport.destination.position.region.city,
            country: apiFlight.data.airport.destination.position.country.name,
            weather: destinationWeather,
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
        };
        messages.push({
          value: JSON.stringify(flight),
        });
      }
    });
  }
  producer.sendMessages(messages, config.CLOUDKARAFKA_TOPIC_HISTORICAL);
};

const modelHistoricalFlights = async (apiFlights: any[], type: FlightsTypes): Promise<Flight[]> => {
  const flights: Flight[] = [];
  apiFlights = apiFlights
      .filter((apiFlight) => apiFlight?.flight?.time.real.departure && apiFlight?.flight?.time.real.arrival);
  for (const apiFlight of apiFlights) {
    const [tlvWeather, anotherWeather] = await Promise.all([
      getWeatherAtCity(tlvDetails.city),
      getWeatherAtCity(FlightsTypes.ARRIVALS ?
              apiFlight?.flight?.airport.origin.position.region.city :
              apiFlight?.data?.airport.destination.position.region.city),
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
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS),
    getAllFlightsByType(FlightsTypes.DEPARTURES, -1),
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


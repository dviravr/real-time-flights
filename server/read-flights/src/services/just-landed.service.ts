import { getFlightFullDetails } from './flight.service';
import { producer } from '../index';
import { config, Flight } from 'real-time-flight-lib';
import { getGeoDistance } from '../utils/geo.utils';

export const justLandedFlights = (justLandedFlights: string[]) => {
  justLandedFlights?.forEach((justLandedFlight) => {
    getFlightFullDetails(justLandedFlight).then((apiFlight) => {
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
        };
        console.log(flight);
        producer.sendMessages([{
          value: JSON.stringify(flight),
        }], config.CLOUDKARAFKA_TOPIC_HISTORICAL);
      }
    });
  });
};

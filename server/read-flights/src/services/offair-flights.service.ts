import { FlightsTypes, getAllFlightsByType } from './flight.service';
import { Flight } from '../model/flight.model';
import moment from 'moment';
import { getGeoDistance } from '../utils/geo.utils';

export const modelToBeDeparturesFlights = (apiFlights: any[], minutesRange: number): Flight[] => {
  const timeToCompare = moment().add(minutesRange, 'minutes').unix();
  const threeHoursAgo = moment().subtract(3, 'hours').unix();

  return apiFlights
      .filter((apiFlight) => !apiFlight.flight.status?.live &&
          !apiFlight.flight.time.real.departure &&
          apiFlight.flight.time.scheduled.departure < timeToCompare &&
          apiFlight.flight.time.scheduled.departure > threeHoursAgo)
      .map((apiFlight) => {
        return {
          id: apiFlight.flight.identification.id,
          callSign: apiFlight.flight.identification.callsign,
          airline: apiFlight.flight.airline.name,
          origin: {
            airport: 'TLV',
            city: 'Tel Aviv',
            country: 'Israel',
            weather: null,
          },
          destination: {
            airport: apiFlight.flight.airport.destination.code.iata,
            city: apiFlight.flight.airport.destination.position.region.city,
            country: apiFlight.flight.airport.destination.position.country.name,
            weather: null,
          },
          scheduledTime: {
            departureTime: apiFlight.flight.time.scheduled.departure,
            arrivalTime: apiFlight.flight.time.scheduled.arrival,
          },
          distance: 1000,
        };
      });
};

export const getNext15MinutesDepartures = async () => {
  const apiDepartures = await getAllFlightsByType(FlightsTypes.DEPARTURES, -1);
  return modelToBeDeparturesFlights(apiDepartures, 15);
};

export const getJustLandedFlights = async () => {
  const apiDepartures = await getAllFlightsByType(FlightsTypes.DEPARTURES, -1);
  const apiArrivals = await getAllFlightsByType(FlightsTypes.ARRIVALS, -1);
};

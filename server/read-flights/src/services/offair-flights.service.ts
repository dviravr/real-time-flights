import { FlightsTypes, getAllFlightsByType } from './flight.service';
import { Flight } from '../model/real-time-flight.model';

export const modelToBeDeparturesFlights = (apiDepartures: any[], minutesRange: number): Flight[] => {
  const toBeDepartureFlights: Flight[] = [];

  return toBeDepartureFlights;
};

export const getNext15MinutesDepartures = async () => {
  const apiDepartures = await getAllFlightsByType(FlightsTypes.DEPARTURES);
  const toBeDepartureFlights = await modelToBeDeparturesFlights(apiDepartures, 15);

  return toBeDepartureFlights;
};

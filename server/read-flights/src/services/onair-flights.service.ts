import { Flight } from '../model/real-time-flight.model';
import { getGeoDistance } from '../utils/geo.utils';
import { FlightsTypes, getAllFlightsByType, getFlightFullDetails } from './flight.service';

const modelOnlineFlights = async (apiFlights: any[]): Promise<Flight[]> => {
  const flights: Flight[] = [];
  const flightsFullDetailsPromise = [];
  apiFlights
      .filter((apiFlight) => apiFlight.flight.status?.live)
      .map((apiFlight) => apiFlight.flight.identification.id)
      .forEach((flightId) => {
        flightsFullDetailsPromise.push(getFlightFullDetails(flightId));
      });
  const flightsFullDetails = await Promise.all(flightsFullDetailsPromise);
  flightsFullDetails.forEach((apiFlight) => {
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

export const getOnAirFlights = async () => {
  const [arrivalsApi, departuresApi] = await Promise.all([
    getAllFlightsByType(FlightsTypes.ARRIVALS),
    getAllFlightsByType(FlightsTypes.DEPARTURES),
  ]);

  const [arrivals, departures] = await Promise.all([
    modelOnlineFlights(arrivalsApi),
    modelOnlineFlights(departuresApi),
  ]);

  return { arrivals, departures };
};

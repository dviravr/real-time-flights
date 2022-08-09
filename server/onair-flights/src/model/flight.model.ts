export interface Flight {
  id: string;
  callSign: string;
  airline: string;
  distance: number;
  actualTime: FlightTime;
  scheduledTime: FlightTime;
  origin: AirportMetadata;
  destination: AirportMetadata;
  trail: Location[];
}

export interface FlightTime {
  departureTime: number;
  arrivalTime: number;
}

export interface AirportMetadata {
  weather: string;
  country: string;
  city: string;
  airport: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  head: number;
}

export enum FlightsTypes {
  ARRIVALS = 'arrivals',
  DEPARTURES = 'departures'
}

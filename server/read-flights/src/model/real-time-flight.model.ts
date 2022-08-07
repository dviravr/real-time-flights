export interface Flight {
  id: string;
  callSign: string;
  airline: string;
  distance: number;
  actualTime?: FlightTime;
  scheduledTime: FlightTime;
  origin: LocationMetadata;
  destination: LocationMetadata;
  trail?: Location[];
}

export interface FlightTime {
  departureTime: number;
  arrivalTime: number;
}

export interface LocationMetadata {
  weather: string;
  country: string;
  city: string;
  airport: Airport;
}

export interface Airport {
  name: string;
  code: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  head: number;
}

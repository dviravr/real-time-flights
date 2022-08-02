export interface RealTimeFlightModel {
  id: string;
  name: string;
  destination: string;
  origin: string;
  location: Location;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
}

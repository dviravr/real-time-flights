export interface Flight {
  id: string;
  company: string;
  distance: number;
  actualTime: FlightDate;
  estimatedTime: FlightDate;
  originData: LocationData;
  destinationData: LocationData;
}

export interface FlightDate {
  departureTime: Date;
  arrivalTime: Date;
}

export interface LocationData {
  weather: string;
  country: string;
  airport: string;
}

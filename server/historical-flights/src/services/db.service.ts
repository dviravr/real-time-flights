import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import mongoose from 'mongoose';
import * as stream from 'stream';

export const dbConnection = mongoose.connection;

export const flightSchema = new mongoose.Schema<Flight>({
  id: String,
  airline: String,
  callSign: String,
  actualTime: {
    departureTime: Number,
    arrivalTime: Number,
  },
  scheduledTime: {
    departureTime: Number,
    arrivalTime: Number,
  },
  distance: Number,
  origin: {
    weather: String,
    country: String,
    city: String,
    airport: String,
  },
  destination: {
    weather: String,
    country: String,
    city: String,
    airport: String,
  },
});

export const bigmlSchema = new mongoose.Schema<{ type: FlightsTypes; createDate: Date; model: string }>({
  type: FlightsTypes,
  createDate: Date,
  model: String,
});

export const flightDbModel = mongoose.model<Flight>('Flights', flightSchema);

export const bigmlDbModel = mongoose.model<{ type: FlightsTypes; createDate: Date; model: string }>('Models', bigmlSchema);

export const connectToDB = async () => {
  await mongoose.connect(config.MONGO_URI);

  dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
  dbConnection.once('open', () => console.log('Connected to DB!'));
};

export const getAllFlights = async () => {
  return flightDbModel.find();
};

export const getAllFlightsByType = async (type: FlightsTypes) => {
  if (type === FlightsTypes.ARRIVALS) {
    return flightDbModel.find({ 'origin.airport': 'TLV' });
  } else {
    return flightDbModel.find({ 'destination.airport': 'TLV' });
  }
};

export const getLastModel = async (type: FlightsTypes) => {
  return bigmlDbModel.findOne({ type }, {}, { sort: { createDate: -1 } });
};

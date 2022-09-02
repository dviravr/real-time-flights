import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import mongoose from 'mongoose';
import { BigmlModelModel } from './bigML.service';

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

export const bigmlSchema = new mongoose.Schema<BigmlModelModel>({
  type: String,
  createDate: Date,
  model: String,
  modelDates: {
    startDate: Date,
    endDate: Date,
  },
});

export const flightDbModel = mongoose.model<Flight>('Flights', flightSchema);

export const bigmlDbModel = mongoose.model<BigmlModelModel>('Models', bigmlSchema);

export const connectToDB = async () => {
  await mongoose.connect(config.MONGO_URI);

  dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
  dbConnection.once('open', () => console.log('Connected to DB!'));
};

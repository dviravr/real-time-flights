import { config, Flight } from 'real-time-flight-lib';
import mongoose from 'mongoose';

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

export const flightModel = mongoose.model<Flight>('Flights', flightSchema);

export const connectToDB = async () => {
  await mongoose.connect(config.MONGO_URI);

  dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
  dbConnection.once('open', () => console.log('Connected to DB!'));
};

export const getAllFlights = async () => {
  return flightModel.find();
};

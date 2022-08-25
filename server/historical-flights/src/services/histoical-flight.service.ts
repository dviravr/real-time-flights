import { Flight } from 'real-time-flight-lib';
import { flightModel } from './db.service';

const isFlightExists = async (flight: Flight) => {
  const dbFlight = await flightModel.findOne({ id: flight.id, actualTime: flight.actualTime }).exec();
  return Boolean(dbFlight);
};

export const saveHistoricalFlight = async (flight: Flight) => {
  const newFlight = new flightModel(flight);

  if (!(await isFlightExists(flight))) {
    newFlight.save((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result.id);
      }
    });
  } else {
    console.log(flight.id, 'found');
  }
};

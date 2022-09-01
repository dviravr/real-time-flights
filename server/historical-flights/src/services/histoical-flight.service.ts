import { Flight } from 'real-time-flight-lib';
import { flightDbModel } from './db.service';
import { isNil } from 'lodash';

const isFlightExists = async (flight: Flight) => {
  const dbFlight = await flightDbModel.findOne({ id: flight.id, actualTime: flight.actualTime }).exec();
  return !isNil(dbFlight);
};

export const saveHistoricalFlight = async (flight: Flight) => {
  const newFlight = new flightDbModel(flight);

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

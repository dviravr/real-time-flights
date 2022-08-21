import { Flight } from 'real-time-flight-lib';
import { flightModel } from './db.service';

export const saveHistoricalFlight = (flight: Flight) => {
  const newFlight = new flightModel(flight);

  newFlight.save((error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result.id);
    }
  });
};

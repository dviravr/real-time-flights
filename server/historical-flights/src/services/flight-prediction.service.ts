import { Flight } from 'real-time-flight-lib';
import { bigmlConnection, flightToBigMlModel, getLastModel, ModelDates } from './bigML.service';
import { Prediction } from 'bigml';

export const predictFlights = async (flights: Flight[], isOnair: boolean, cb: Function, modelDates?: ModelDates) => {
  const lastModel = await getLastModel(isOnair, modelDates);
  const predictedFlights = {};

  new Promise((resolve, reject) => {
    const prediction = new Prediction(bigmlConnection);
    flights.forEach((flight) => {
      const bigmlFlight = flightToBigMlModel(flight, isOnair);

      prediction.create(lastModel.model, bigmlFlight, (error, predictionInfo) => {
        if (!error && predictionInfo) {
          predictedFlights[flight.id] = predictionInfo.object.output;
          if (Object.keys(predictedFlights).length === flights.length) {
            resolve(predictedFlights);
          }
        } else {
          reject(new Error('failed to predict flight delay'));
        }
      });
    });
  }).then((predicted) => {
    return cb(predicted, 200);
  }).catch((error: Error) => {
    return cb(error.message, 400);
  });
};

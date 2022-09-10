import { Flight, FlightsTypes } from 'real-time-flight-lib';
import { bigmlConnection, flightToBigMlModel, getLastModel, isArrival, ModelDates } from './bigML.service';
import { Prediction } from 'bigml';

export const predictFlights = async (flights: Flight[], cb: Function, modelDates?: ModelDates) => {
  const flightType = isArrival(flights[0]) ? FlightsTypes.ARRIVALS : FlightsTypes.DEPARTURES;
  const lastModel = await getLastModel(flightType, modelDates);
  const predictedFlights = [];

  new Promise((resolve, reject) => {
    const prediction = new Prediction(bigmlConnection);
    flights.forEach((flight) => {
      const bigmlFlight = flightToBigMlModel(flight);

      prediction.create(lastModel.model, bigmlFlight, (error, predictionInfo) => {
        if (!error && predictionInfo) {
          predictedFlights.push({ id: flight.id, prediction: predictionInfo.object.output });
          if (predictedFlights.length === flights.length) {
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

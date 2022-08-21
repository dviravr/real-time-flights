import { getAllFlights } from './db.service';
import { Flight } from 'real-time-flight-lib';

const bigml = require('bigml');
const source = new bigml.Source();

source.create('./iris.csv', (error, sourceInfo) => {
  if (!error && sourceInfo) {
    const dataset = new bigml.Dataset();
    dataset.create(sourceInfo, (error, datasetInfo) => {
      if (!error && datasetInfo) {
        const model = new bigml.Model();
        model.create(datasetInfo, (error, modelInfo) => {
          if (!error && modelInfo) {
            const prediction = new bigml.Prediction();
            prediction.create(modelInfo, { 'petal length': 1 });
          }
        });
      }
    });
  }
});

enum PeriodOfTheYear {
  REGULAR,
  HOLIDAYS,
  SUMMER,
}

enum DistanceFlightType {
  SHORT,
  MID,
  LONG,
}

enum DelayRate {
  ON_TIME,
  SLIGHT_DELAY,
  HAVEY_DELAY
}

const getFlightTypeByDistance = (distance: number): DistanceFlightType => {
  if (distance < 1500) {
    return DistanceFlightType.SHORT;
  } else if (distance < 3500) {
    return DistanceFlightType.MID;
  }
  return DistanceFlightType.LONG;
};

const getFlightDelayRate = (scheduledTime: number, actualTime: number): DelayRate => {
  const minute = 60; // 60 sec
  const hour = 60 * minute; // 60 minute
  if (actualTime - scheduledTime < 15 * minute) {
    return DelayRate.ON_TIME;
  } else if (actualTime - scheduledTime < hour) {
    return DelayRate.SLIGHT_DELAY;
  }
  return DelayRate.HAVEY_DELAY;
};

const getPeriodOfTheYear = (day: Date): PeriodOfTheYear => {
  if (day.getMonth() === 6 || day.getMonth() === 7) {
    return PeriodOfTheYear.SUMMER;
  }
  return PeriodOfTheYear.REGULAR;
};

export const createDatafile = async () => {
  const allFlights: Flight[] = await getAllFlights();
  const mappedFlights = allFlights.map((flight) => {
    return {
      airline: flight.airline,
      origin: flight.origin.country,
      destination: flight.destination.country,
      distanceFlightType: getFlightTypeByDistance(flight.distance),
      dayInWeek: new Date(flight.actualTime.departureTime * 1000).getDay(),
      monthInYear: new Date(flight.actualTime.departureTime * 1000).getMonth(),
      periodOfYear: getPeriodOfTheYear(new Date(flight.actualTime.departureTime * 1000)),
      arrivalDelayRate: getFlightDelayRate(flight.scheduledTime.arrivalTime, flight.actualTime.arrivalTime),
      departureDelayRate: getFlightDelayRate(flight.scheduledTime.departureTime, flight.actualTime.departureTime),
    };
  });
};

export const createDataSetBigML = () => {

};
export const createModelBigML = () => {

};
export const predictionBigML = () => {

};

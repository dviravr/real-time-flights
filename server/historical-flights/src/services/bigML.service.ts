import { getAllFlights } from './db.service';
import { Flight } from 'real-time-flight-lib';
import { isNil } from 'lodash';
import { HebrewCalendar } from '@hebcal/core';
import { Dataset, Model, Prediction, Source, BigML } from 'bigml';

const connection = new BigML('DVIRAVR', '50193977c80c720a87bb5540867fc84c248e26bc');
const source = new Source(connection);

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

const isHoliday = (day: Date): boolean => {
  return isNil(HebrewCalendar.getHolidaysOnDate(day, true));
};

const getPeriodOfTheYear = (day: Date): PeriodOfTheYear => {
  if (day.getMonth() === 6 || day.getMonth() === 7) {
    return PeriodOfTheYear.SUMMER;
  } if (isHoliday(day)) {
    return PeriodOfTheYear.HOLIDAYS;
  }
  return PeriodOfTheYear.REGULAR;
};

const createDatafile = async () => {
  const allFlights: Flight[] = await getAllFlights();
  return allFlights.map((flight) => {
    return {
      airline: flight.airline,
      origin: flight.origin.country,
      destination: flight.destination.country,
      originWeather: flight.origin.weather,
      destinationWeather: flight.destination.weather,
      distanceFlightType: getFlightTypeByDistance(flight.distance),
      dayInWeek: new Date(flight.actualTime.departureTime * 1000).getDay(),
      monthInYear: new Date(flight.actualTime.departureTime * 1000).getMonth(),
      periodOfYear: getPeriodOfTheYear(new Date(flight.actualTime.departureTime * 1000)),
      arrivalDelayRate: getFlightDelayRate(flight.scheduledTime.arrivalTime, flight.actualTime.arrivalTime),
      departureDelayRate: getFlightDelayRate(flight.scheduledTime.departureTime, flight.actualTime.departureTime),
    };
  });
};

export const bigML = async () => {
  const data = await createDatafile();
  const flight = {
    airline: 'El Al',
    origin: 'Netherlands',
    destination: 'Israel',
    originWeather: 'Fog',
    destinationWeather: 'Sunny',
    distanceFlightType: 1,
    dayInWeek: 4,
    monthInYear: 7,
    periodOfYear: 2,
  };

  const prediction = new Prediction(connection);
  prediction.create('model/630893098f679a2d430009a2', flight, (error, predictionInfo) => {
    if (!error && predictionInfo) {
      console.log(predictionInfo);
    } else {
      console.log(error);
    }
  });

  // source.create(data, (error, sourceInfo) => {
  //   if (!error && sourceInfo) {
  //     const dataset = new Dataset();
  //     dataset.create(sourceInfo, (error, datasetInfo) => {
  //       if (!error && datasetInfo) {
  //         const model = new Model();
  //         model.create(datasetInfo, (error, modelInfo) => {
  //           if (!error && modelInfo) {
  //             const prediction = new Prediction();
  //             prediction.create(modelInfo, { 'petal length': 1 });
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     console.log(error);
  //   }
  // });
};

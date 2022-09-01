import { bigmlDbModel, getAllFlightsByType, getFlightsByDateAndType, getLastModel } from './db.service';
import { Flight, FlightsTypes } from 'real-time-flight-lib';
import { isNil } from 'lodash';
import { HebrewCalendar } from '@hebcal/core';
import { BigML, Dataset, Model, Prediction, Source } from 'bigml';
import { Parser } from 'json2csv';
import { writeFile } from 'fs';

const connection = new BigML('DVIRAVR', '50193977c80c720a87bb5540867fc84c248e26bc');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

enum PeriodOfTheYear {
  REGULAR = 'regular',
  HOLIDAYS = 'holidays',
  SUMMER = 'summer',
}

enum DistanceFlightType {
  SHORT = 'short',
  MID = 'mid',
  LONG = 'long',
}

enum DelayRate {
  ON_TIME = 'on time',
  SLIGHT_DELAY = 'slight delay',
  HEAVY_DELAY = 'heavy delay'
}

const isArrival = (flight: Flight): boolean => {
  return flight.destination.airport === 'TLV';
};

const getDistanceType = (distance: number): DistanceFlightType => {
  if (distance < 1500) {
    return DistanceFlightType.SHORT;
  } else if (distance < 3500) {
    return DistanceFlightType.MID;
  }
  return DistanceFlightType.LONG;
};

const getFlightDelayRate = (scheduledTime: number, actualTime: number): DelayRate => {
  if (!scheduledTime || !actualTime) {
    return undefined;
  }
  const minute = 60; // 60 sec
  const hour = 60 * minute; // 60 minute
  if (actualTime - scheduledTime < 15 * minute) {
    return DelayRate.ON_TIME;
  } else if (actualTime - scheduledTime < hour) {
    return DelayRate.SLIGHT_DELAY;
  }
  return DelayRate.HEAVY_DELAY;
};

const isHoliday = (day: Date): boolean => {
  return isNil(HebrewCalendar.getHolidaysOnDate(day, true));
};

const getPeriodOfTheYear = (day: Date): PeriodOfTheYear => {
  if (day.getMonth() === 6 || day.getMonth() === 7) {
    return PeriodOfTheYear.SUMMER;
  } else if (isHoliday(day)) {
    return PeriodOfTheYear.HOLIDAYS;
  }
  return PeriodOfTheYear.REGULAR;
};

const flightToBigMlModel = (flight: Flight) => {
  const bigmlFlight = {
    airline: flight.airline,
    origin: flight.origin.country,
    destination: flight.destination.country,
    originWeather: flight.origin.weather,
    destinationWeather: flight.destination.weather,
    distanceFlightType: getDistanceType(flight.distance),
    dayInWeek: days[new Date(flight.actualTime.departureTime * 1000).getDay()],
    monthInYear: months[new Date(flight.actualTime.departureTime * 1000).getMonth()],
    periodOfYear: getPeriodOfTheYear(new Date(flight.actualTime.departureTime * 1000)),
  };

  return isArrival(flight) ? {
    ...bigmlFlight,
    departureDelayRate: getFlightDelayRate(flight.scheduledTime?.departureTime, flight.actualTime?.departureTime),
    arrivalDelayRate: getFlightDelayRate(flight.scheduledTime?.arrivalTime, flight.actualTime?.arrivalTime),
  } : {
    ...bigmlFlight,
    arrivalDelayRate: getFlightDelayRate(flight.scheduledTime?.arrivalTime, flight.actualTime?.arrivalTime),
    departureDelayRate: getFlightDelayRate(flight.scheduledTime?.departureTime, flight.actualTime?.departureTime),
  };
};

const createFlightsDataFile = async (type: FlightsTypes) => {
  const flights: Flight[] = await getAllFlightsByType(type);

  const flightsModel = flights.map((flight) => {
    return flightToBigMlModel(flight);
  });
  const fields = Object.keys(flightsModel[0]);

  const parser = new Parser({ fields });
  return parser.parse(flightsModel);
};

export const createModelByType = async (type: FlightsTypes, callback: Function) => {
  const csv = await createFlightsDataFile(type);
  const fileName = `${type}.csv`;

  try {
    writeFile(fileName, csv, (err) => {
      if (err) throw err;
      const source = new Source(connection);
      source.create(`C:\\Users\\dvira\\dev\\real-time-flights\\server\\historical-flights\\${fileName}`, (error, sourceInfo) => {
        if (!error && sourceInfo) {
          const dataset = new Dataset(connection);
          dataset.create(sourceInfo.resource, (error, datasetInfo) => {
            if (!error && datasetInfo) {
              const model = new Model(connection);
              model.create(datasetInfo.resource, async (error, modelInfo) => {
                if (!error && modelInfo) {
                  try {
                    await saveModelToDB(FlightsTypes.ARRIVALS, modelInfo.resource);
                    return callback('model was created', 200);
                  } catch (e) {
                    return callback('failed to save model to db', 400);
                  }
                } else {
                  return callback('failed to create model', 400);
                }
              });
            } else {
              return callback('failed to create dataset', 400);
            }
          });
        } else {
          return callback('failed to create source', 400);
        }
      });
    });
  } catch (e) {
    return callback('failed to write to file', 400);
  }
};

export const predictFlight = async (flight: Flight, callback: Function) => {
  const bigmlFlight = flightToBigMlModel(flight);

  const flightType = isArrival(flight) ? FlightsTypes.ARRIVALS : FlightsTypes.DEPARTURES;
  const lastModel = await getLastModel(flightType);

  const prediction = new Prediction(connection);
  prediction.create(lastModel.model, bigmlFlight, (error, predictionInfo) => {
    if (!error && predictionInfo) {
      return callback(predictionInfo.object.output, 200);
    } else {
      return callback('failed to predict flight delay', 400);
    }
  });
};

export const createModelByTypeAndDate = async (type: FlightsTypes, startDate: Date, endDate: Date, cb: Function) => {
  const flights = await getFlightsByDateAndType(type, startDate, endDate);
  console.log('');
};

export const saveModelToDB = async (type: FlightsTypes, model: string) => {
  const newBigmlModel = new bigmlDbModel({
    model,
    type,
    createDate: new Date(),
  });

  return await newBigmlModel.save();
};

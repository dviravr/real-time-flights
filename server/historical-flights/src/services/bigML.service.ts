import { bigmlDbModel } from './db.service';
import { config, Flight, FlightsTypes } from 'real-time-flight-lib';
import { isNil } from 'lodash';
import { HebrewCalendar } from '@hebcal/core';
import { BigML, Dataset, Model, Source } from 'bigml';
import { Parser } from 'json2csv';
import { writeFile } from 'fs';
import { getAllFlights, getFlightsByDates } from './histoical-flight.service';
import moment, { Moment } from 'moment';

export const bigmlConnection = new BigML(config.BIGML_USERNAME, config.BIGML_API_KEY);

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface BigmlModelModel {
  isOnair: boolean;
  createDate: Date;
  model: string;
  modelDates?: ModelDates;
}

export interface ModelDates {
  startDate: Date;
  endDate: Date;
}

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

export const isArrival = (flight: Flight): boolean => {
  return flight?.destination?.airport === config.TLV_DETAILS.airport;
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

export const flightToBigMlModel = (flight: Flight, isOnair: boolean) => {
  const bigmlFlight = {
    airline: flight.airline,
    origin: flight.origin.country,
    destination: flight.destination.country,
    originWeather: flight.origin.weather,
    destinationWeather: flight.destination.weather,
    distanceFlightType: getDistanceType(flight.distance),
    dayInWeek: days[new Date(flight.scheduledTime.departureTime * 1000).getDay()],
    monthInYear: months[new Date(flight.scheduledTime.departureTime * 1000).getMonth()],
    periodOfYear: getPeriodOfTheYear(new Date(flight.scheduledTime.departureTime * 1000)),
  };

  return isOnair ? {
    ...bigmlFlight,
    departureDelayRate: getFlightDelayRate(flight.scheduledTime?.departureTime, flight.actualTime?.departureTime),
    arrivalDelayRate: getFlightDelayRate(flight.scheduledTime?.arrivalTime, flight.actualTime?.arrivalTime),
  } : {
    ...bigmlFlight,
    arrivalDelayRate: getFlightDelayRate(flight.scheduledTime?.arrivalTime, flight.actualTime?.arrivalTime),
    departureDelayRate: getFlightDelayRate(flight.scheduledTime?.departureTime, flight.actualTime?.departureTime),
  };
};

const createFlightsDataFile = async (flights: Flight[], isOnair: boolean) => {
  const flightsModel = flights.map((flight) => {
    return flightToBigMlModel(flight, isOnair);
  });
  const fields = Object.keys(flightsModel[0]);

  const parser = new Parser({ fields });
  return parser.parse(flightsModel);
};

const createModal = (fileName: string, isOnair: boolean, csv, cb: Function, modelDates?: ModelDates) => {
  try {
    writeFile(`${__dirname}\\${fileName}`, csv, (err) => {
      if (err) throw err;
      const source = new Source(bigmlConnection);
      source.create(`${__dirname}\\${fileName}`, (error, sourceInfo) => {
        if (!error && sourceInfo) {
          const dataset = new Dataset(bigmlConnection);
          dataset.create(sourceInfo.resource, (error, datasetInfo) => {
            if (!error && datasetInfo) {
              const model = new Model(bigmlConnection);
              model.create(datasetInfo.resource, async (error, modelInfo) => {
                if (!error && modelInfo) {
                  try {
                    await saveModelToDB(isOnair, modelInfo.resource, modelDates);
                    return cb('model was created', 200);
                  } catch (e) {
                    return cb('failed to save model to db', 400);
                  }
                } else {
                  return cb('failed to create model', 400);
                }
              });
            } else {
              return cb('failed to create dataset', 400);
            }
          });
        } else {
          return cb('failed to create source', 400);
        }
      });
    });
  } catch (e) {
    return cb('failed to write to file', 400);
  }
};

export const createModelByType = async (isOnair: boolean, cb: Function) => {
  const flights: Flight[] = await getAllFlights();
  const csv = await createFlightsDataFile(flights, isOnair);
  const fileName = `${isOnair ? 'onair': 'takeoff'}.csv`;

  return createModal(fileName, isOnair, csv, cb);
};

export const createModelByTypeAndDates = async (isOnair: boolean, startDate: Moment, endDate: Moment, cb: Function) => {
  const flights = await getFlightsByDates(startDate, endDate);
  const csv = await createFlightsDataFile(flights, isOnair);
  const fileName = `${isOnair ? 'onair' : 'takeoff'}${moment(startDate).unix()}-${moment(endDate).unix()}.csv`;

  return createModal(fileName, isOnair, csv, cb, { startDate: startDate.toDate(), endDate: endDate.toDate() });
};

export const saveModelToDB = async (isOnair: boolean, model: string, modelDates?: ModelDates) => {
  const newBigmlModel = new bigmlDbModel({
    model,
    isOnair,
    modelDates,
    createDate: new Date(),
  });

  return await newBigmlModel.save();
};

export const getLastModel = async (isOnair: boolean, modelDates?: ModelDates) => {
  return bigmlDbModel.findOne({ isOnair, modelDates }, {}, { sort: { createDate: -1 } }).exec();
};

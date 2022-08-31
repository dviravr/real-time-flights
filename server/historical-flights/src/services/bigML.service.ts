import { bigmlDbModel, getAllFlights, getAllFlightsByType } from './db.service';
import { Flight, FlightsTypes } from 'real-time-flight-lib';
import { isNil } from 'lodash';
import { HebrewCalendar } from '@hebcal/core';
import { BigML, Source, Prediction, Dataset, Model } from 'bigml';
import { Parser } from 'json2csv';
import { writeFile } from 'fs';

const connection = new BigML('DVIRAVR', '50193977c80c720a87bb5540867fc84c248e26bc');
const departuresModel = 'model/630b7f37aba2df5330000aec';
const arrivalsModel = 'model/630b7ece8f679a2d4a00098d';

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
  return {
    airline: flight.airline,
    origin: flight.origin.country,
    destination: flight.destination.country,
    originWeather: flight.origin.weather,
    destinationWeather: flight.destination.weather,
    distanceFlightType: getFlightTypeByDistance(flight.distance),
    dayInWeek: days[new Date(flight.actualTime.departureTime * 1000).getDay()],
    monthInYear: months[new Date(flight.actualTime.departureTime * 1000).getMonth()],
    periodOfYear: getPeriodOfTheYear(new Date(flight.actualTime.departureTime * 1000)),
    arrivalDelayRate: getFlightDelayRate(flight.scheduledTime.arrivalTime, flight.actualTime.arrivalTime),
    departureDelayRate: getFlightDelayRate(flight.scheduledTime.departureTime, flight.actualTime.departureTime),
  };
};

const createDatafile = async () => {
  const flights: Flight[] = await getAllFlights();

  const flightsModel = flights.map((flight) => {
    return flightToBigMlModel(flight);
  });
  const fields = Object.keys(flightsModel[0]);

  const parser = new Parser({ fields });
  return parser.parse(flightsModel);
};

export const bigML = async () => {
  const flight = {
    airline: 'Transavia',
    origin: 'France',
    destination: 'Israel',
    originWeather: 'Clear',
    destinationWeather: 'Sunny',
    distanceFlightType: DistanceFlightType.MID,
    dayInWeek: days[3],
    monthInYear: months[7],
    departureDelayRate: DelayRate.HEAVY_DELAY,
    periodOfYear: PeriodOfTheYear.SUMMER,
  };

  const csv = await createDatafile();

  try {
    writeFile('file.csv', csv, (err) => {
      if (err) throw err;
      const source = new Source(connection);
      source.create('C:\\Users\\dvira\\dev\\real-time-flights\\server\\historical-flights\\file.csv', (error, sourceInfo) => {
        if (!error && sourceInfo) {
          const dataset = new Dataset(connection);
          dataset.create(sourceInfo.resource, (error, datasetInfo) => {
            if (!error && datasetInfo) {
              const model = new Model(connection);
              model.create(datasetInfo.resource, (error, modelInfo) => {
                if (!error && modelInfo) {
                  const prediction = new Prediction(connection);
                  prediction.create(modelInfo.resource, flight, (error, predictionInfo) => {
                    if (!error && predictionInfo) {
                      console.log(predictionInfo);
                    } else {
                      console.log(error);
                    }
                  });
                }
              });
            }
          });
        } else {
          console.log(error);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
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

export const createArrivalsModel = async (callback: Function) => {
  const arrivalsCsv = await createFlightsDataFile(FlightsTypes.ARRIVALS);

  try {
    writeFile('arrivals.csv', arrivalsCsv, (err) => {
      if (err) throw err;
      const source = new Source(connection);
      source.create('C:\\Users\\dvira\\dev\\real-time-flights\\server\\historical-flights\\arrivals.csv', (error, sourceInfo) => {
        if (!error && sourceInfo) {
          const dataset = new Dataset(connection);
          dataset.create(sourceInfo.resource, (error, datasetInfo) => {
            if (!error && datasetInfo) {
              const model = new Model(connection);
              model.create(datasetInfo.resource, async (error, modelInfo) => {
                if (!error && modelInfo) {
                  const res = await saveModelToDB(FlightsTypes.ARRIVALS, modelInfo.resource);
                  if (res?._id) {
                    callback();
                  }
                }
              });
            }
          });
        } else {
          console.log(error);
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

export const saveModelToDB = async (type: FlightsTypes, model: string) => {
  const newBigmlModel = new bigmlDbModel({
    model,
    type,
    createDate: new Date(),
  });

  try {
    const res = await newBigmlModel.save();
    return res._id;
  } catch (e) {
    return e;
  }
};

import { Flight, FlightsTypes } from 'real-time-flight-lib';
import { flightDbModel } from './db.service';
import { isNil } from 'lodash';
import { Moment } from 'moment';

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
    console.log(flight.id, 'already exists');
  }
};

export const getAllFlightsByType = async (type: FlightsTypes) => {
  if (type === FlightsTypes.DEPARTURES) {
    return flightDbModel.find({ 'origin.airport': 'TLV' }, {}, { sort: { createDate: -1 } });
  } else {
    return flightDbModel.find({ 'destination.airport': 'TLV' }, {}, { sort: { createDate: -1 } });
  }
};

export const getFlightsByDateAndType = async (type: FlightsTypes, startDate: Moment, endDate: Moment) => {
  const filterType = flightDbModel.find({
    'scheduledTime.departureTime': {
      $gte: startDate.unix(),
      $lte: endDate.unix(),
    },
  });
  if (type === FlightsTypes.DEPARTURES) {
    filterType.find({ 'origin.airport': 'TLV' });
  } else {
    filterType.find({ 'destination.airport': 'TLV' });
  }
  console.log(filterType.getFilter());

  return filterType.exec();
};

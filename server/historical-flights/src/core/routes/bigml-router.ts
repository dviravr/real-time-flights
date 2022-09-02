import express from 'express';
import { createModelByType, createModelByTypeAndDates } from '../../services/bigML.service';
import { FlightsTypes } from 'real-time-flight-lib';
import { predictFlights } from '../../services/flight-prediction.service';
import moment from 'moment';

const router = express.Router();

router.post('/bigml/createArrivalsModelByDate', ((req, res) => {
  const startDate = new Date(1661806800 * 1000);
  const endDate = new Date(1661893200 * 1000);
  createModelByTypeAndDates(
      FlightsTypes.DEPARTURES,
      moment(startDate).startOf('day'),
      moment(endDate).startOf('day'),
      (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createArrivalsModel', ((req, res) => {
  createModelByType(FlightsTypes.ARRIVALS, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createDeparturesModel', ((req, res) => {
  createModelByType(FlightsTypes.DEPARTURES, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/predictFlight', ((req, res) => {
  const modelDates = req.body.startDate && req.body.endDate ? { startDate: req.body.startDate, endDate: req.body.endDate } : undefined;
  predictFlights(
      req.body.flights,
      (body: Array<{ id: string; prediction: string }> | string, status: number) => res.status(status).send(body),
      modelDates,
  );
}));

export { router as bigmlRouter };

import express from 'express';
import { createModelByType, createModelByTypeAndDates } from '../../services/bigML.service';
import { FlightsTypes } from 'real-time-flight-lib';
import { predictFlights } from '../../services/flight-prediction.service';
import moment from 'moment';

const router = express.Router();

router.post('/bigml/createArrivalsModelByDate', ((req, res) => {
  if (!req?.body?.startDate || !req?.body?.endDate) res.status(400).send('missing startDate or endDate');
  createModelByTypeAndDates(
      FlightsTypes.ARRIVALS,
      moment(req.body.startDate).startOf('day'),
      moment(req.body.endDate).startOf('day'),
      (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createDeparturesModelByDate', ((req, res) => {
  if (!req?.body?.startDate || !req?.body?.endDate) res.status(400).send('missing startDate or endDate');
  createModelByTypeAndDates(
      FlightsTypes.DEPARTURES,
      moment(req.body.startDate).startOf('day'),
      moment(req.body.endDate).startOf('day'),
      (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createArrivalsModel', ((req, res) => {
  createModelByType(FlightsTypes.ARRIVALS, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createDeparturesModel', ((req, res) => {
  createModelByType(FlightsTypes.DEPARTURES, (body: string, status: number) => res.status(status).send(body));
}));
// /bigml/predictFlight
router.post('/bigml/predictFlights', ((req, res) => {
  const modelDates = req?.body?.startDate && req?.body?.endDate ? { startDate: req.body.startDate, endDate: req.body.endDate } : undefined;
  predictFlights(
      req.body.flights,
      (body: Array<{ id: string; prediction: string }> | string, status: number) => res.status(status).send(body),
      modelDates,
  );
}));

export { router as bigmlRouter };

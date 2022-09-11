import express from 'express';
import { createModelByType, createModelByTypeAndDates } from '../../services/bigML.service';
import { FlightsTypes } from 'real-time-flight-lib';
import { predictFlights } from '../../services/flight-prediction.service';
import moment from 'moment';

const router = express.Router();

router.post('/bigml/createOnairModelByDate', ((req, res) => {
  if (!req?.body?.startDate || !req?.body?.endDate) res.status(400).send('missing startDate or endDate');
  createModelByTypeAndDates(
      true,
      moment(req.body.startDate).startOf('day'),
      moment(req.body.endDate).endOf('day'),
      (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createTakeoffModelByDate', ((req, res) => {
  if (!req?.body?.startDate || !req?.body?.endDate) res.status(400).send('missing startDate or endDate');
  createModelByTypeAndDates(
      false,
      moment(req.body.startDate).startOf('day'),
      moment(req.body.endDate).endOf('day'),
      (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createOnairModel', ((req, res) => {
  createModelByType(true, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createTakeoffModel', ((req, res) => {
  createModelByType(false, (body: string, status: number) => res.status(status).send(body));
}));
// /bigml/predictFlight
router.post('/bigml/predictFlights', ((req, res) => {
  const modelDates = req?.body?.startDate && req?.body?.endDate ? {
    startDate: moment(req.body.startDate).startOf('day').toDate(),
    endDate: moment(req.body.endDate).endOf('day').toDate()
  } : undefined;
  predictFlights(
      req.body.flights,
      req.body.isOnair,
      (body: {[id: string]: string} | string, status: number) => res.status(status).send(body),
      modelDates,
  );
}));

router.get('/bigml', ((req, res) => {
  console.log('sasdad');
  res.status(200).send();
}));

export { router as bigmlRouter };

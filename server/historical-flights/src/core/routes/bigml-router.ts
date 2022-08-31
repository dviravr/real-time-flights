import express from 'express';
import { createModelByType, predictFlight } from '../../services/bigML.service';
import { FlightsTypes } from 'real-time-flight-lib';

const router = express.Router();

router.post('/bigml/createArrivalsModel', ((req, res) => {
  createModelByType(FlightsTypes.ARRIVALS, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/createDeparturesModel', ((req, res) => {
  createModelByType(FlightsTypes.DEPARTURES, (body: string, status: number) => res.status(status).send(body));
}));

router.post('/bigml/predictFlight', ((req, res) => {
  predictFlight(req.body.flight, (body: string, status: number) => res.status(status).send(body));
}));

export { router as bigmlRouter };

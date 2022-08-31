import express from 'express';
import { createArrivalsModel } from '../../services/bigML.service';

const router = express.Router();

router.post('/bigml/createArrivalsModel', ((req, res) => {
  createArrivalsModel(() => res.send('get request example'));
  // return res.send('get request example');
}));

router.post('/bigml/createDeparturesModel', ((req, res) => {
  return res.send('post request example');
}));


export { router as bigmlRouter };

import express from 'express';
import { producer } from '../index';

const router = express.Router();

router.get('/producer/get', ((req, res) => {
  return res.send('get request example');
}));

router.post('/producer/sendMessage', (async (req, res) => {
  console.log(req.body);
  await producer.sendMessages([
    {
      value: req.body.message,
    },
    {
      value: Buffer.from(JSON.stringify(req.body)),
    }
  ]);
  return res.send('post request example');
}));


export { router as producerRouter };

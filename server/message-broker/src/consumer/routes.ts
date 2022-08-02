import express from 'express';

const router = express.Router();

router.get('/consumer/get', ((req, res) => {
  return res.send('get request example');
}));

router.post('/consumer/post', ((req, res) => {
  return res.send('post request example');
}));


export { router as consumerRouter };

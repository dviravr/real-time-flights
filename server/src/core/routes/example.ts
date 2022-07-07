import express from 'express';

const router = express.Router();

router.get('/example/get', ((req, res) => {
  return res.send('get request example');
}));

router.post('/example/post', ((req, res) => {
  return res.send('post request example');
}));


export { router as exampleRouter }

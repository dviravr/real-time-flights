import express from 'express';
const index = express();
const port = 3000;

index.get('/', (req, res) => {
  res.send('Hello World!');
});

index.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

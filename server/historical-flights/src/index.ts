import express from 'express';
import { json } from 'body-parser';
import { exampleRouter } from './core/routes/example';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const uri = 'mongodb+srv://historicalFlights:gpb4M8XcRO6iMGBm@cluster0.v0awa.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri);

const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
dbConnection.once('open', () => console.log('Connected to DB!'));

app.use(json());
app.use(exampleRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${ port }`);
});
import express from 'express';
import { json } from 'body-parser';
import { getOnAirFlights } from './services/onair-flights.service';


const app = express();
const port = 5000;

app.use(json());

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  const a = await getOnAirFlights();
  console.log('');
});

import express from 'express';
import { json } from 'body-parser';
import { ProducerService } from 'real-time-flight-lib';
import { connectMysql } from './services/logger.service';
import { sendGoingToDepartureFlights } from './services/offair-flights.service';
import { schedule } from 'node-cron';
import { sendOnAirFlights } from './services/onair-flights.service';
import { sendHistoricalFlights } from './services/landed.service';
export const producer = new ProducerService();

const app = express();
const port = 5001;

app.use(json());

connectMysql();

schedule('* * * * *', () => { // cron job every minute
  sendOnAirFlights();
  sendGoingToDepartureFlights();
});

schedule('0 0 * * *', () => { // cron job every day at 00:00
  sendHistoricalFlights();
});

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  // sendOnAirFlights();
  // sendHistoricalFlights();
});

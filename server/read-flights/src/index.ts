import express from 'express';
import { json } from 'body-parser';
import { sendOnAirFlights } from './services/onair-flights.service';
import { config } from './config';
import { ProducerService } from './kafka/producer/producer.service';

export const producer = new ProducerService();

const app = express();
const port = 5000;

app.use(json());

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  await producer.connect();

  setInterval(() => {
    sendOnAirFlights();
    // sendOffAirFlights();
  }, config.REQUEST_INTERVAL);
  // const a = await getOnAirFlights();
  // const b = await getNext15MinutesDepartures();
  // b.forEach((flight) => {
  //   console.log({
  //     dest: flight.destination.city,
  //     time: new Date(1000 * flight.scheduledTime.departureTime),
  //   });
  // });
  console.log('');
});

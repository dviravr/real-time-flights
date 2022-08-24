import express from 'express';
import { json } from 'body-parser';
import { config, ConsumerService, ProducerService } from 'real-time-flight-lib';
import { connectMysql } from './services/logger.service';
import { sendOnAirFlights } from './services/onair-flights.service';
import { justLandedFlights } from './services/just-landed.service';
import { tlvDetails } from './services/flight.service';
import { getWeatherAtCity } from './services/weather.service';

export const producer = new ProducerService();
export const justLandedConsumer = new ConsumerService('just-landed', config.CLOUDKARAFKA_TOPIC_JUST_LANDED);

const app = express();
const port = 5000;

app.use(json());

connectMysql();

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  // sendOnAirFlights();
  // sendHistoricalFlights();
  console.log(await getWeatherAtCity(tlvDetails.city));
  setInterval(() => {
    // sendOnAirFlights();
    // sendOffAirFlights();
  }, config.REQUEST_INTERVAL);
  await justLandedConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      justLandedFlights(JSON.parse(message.value.toString()));
    },
  });
});

import express from 'express';
import { json } from 'body-parser';
import { redisClient, saveFlight, saveFlights } from './services/redis.service';
import { config, ConsumerService, ProducerService } from 'real-time-flight-lib';
import { FlightsTypes } from 'real-time-flight-lib/lib/model/flight.model';

export const onAirConsumer = new ConsumerService('on-air-consumer', config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS);
export const justLandedProducer = new ProducerService();

const app = express();
const port = 4000;

app.use(json());

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  await redisClient.connect();

  await redisClient.flushDb();
  await onAirConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.key.toString() === FlightsTypes.ARRIVALS || message.key.toString() === FlightsTypes.DEPARTURES) {
        await saveFlights(message.key.toString(), JSON.parse(message.value.toString()));
      } else {
        await saveFlight(message.key.toString(), message.value.toString());
      }
    },
  });
});

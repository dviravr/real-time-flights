import express from 'express';
import { json } from 'body-parser';
import { redisClient, saveFlight, saveFlightsByType } from './services/redis.service';
import { config, ConsumerService } from 'real-time-flight-lib';
import { FlightsTypes } from 'real-time-flight-lib/lib/model/flight.model';

export const onAirConsumer = new ConsumerService('on-air-consumer-1', config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS);
export const takeoffConsumer = new ConsumerService('takeoff-consumer-1', config.CLOUDKARAFKA_TOPIC_TAKE_OFF);

const app = express();
const port = 5002;

app.use(json());

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);
  await redisClient.connect();

  await redisClient.flushDb();
  await onAirConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.key.toString() === FlightsTypes.ARRIVALS || message.key.toString() === FlightsTypes.DEPARTURES) {
        await saveFlightsByType(message.key.toString(), JSON.parse(message.value.toString()));
      } else {
        await saveFlight(message.key.toString(), message.value.toString());
      }
    },
  });
  await takeoffConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.key.toString() === 'takeoff') {
        await saveFlightsByType(message.key.toString(), JSON.parse(message.value.toString()));
      } else {
        await saveFlight(message.key.toString(), message.value.toString());
      }
    },
  });
});

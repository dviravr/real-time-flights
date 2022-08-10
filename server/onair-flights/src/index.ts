import express from 'express';
import { json } from 'body-parser';
import { redisClient, saveFlights } from './services/redis.service';
import { config, ConsumerService } from 'real-time-flight-lib';

export const onAirConsumer = new ConsumerService('on-air-consumer', config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS);

const app = express();
const port = 4000;

app.use(json());

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${port}`);

  await redisClient.connect();
  const f = {
    id: '123',
    time: new Date().getTime(),
    location: {
      lat: 123,
      lon: 321,
    },
  };

  await redisClient.set(f.id, JSON.stringify(f));
  const newF = await redisClient.get(f.id);
  const jsonF = JSON.parse(newF);

  await onAirConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await saveFlights(message.key.toString(), JSON.parse(message.value.toString()));
    },
  });
});

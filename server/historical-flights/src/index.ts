import express from 'express';
import { json } from 'body-parser';
import { config, ConsumerService } from 'real-time-flight-lib';
import { connectToDB } from './services/db.service';
import { saveHistoricalFlight } from './services/histoical-flight.service';
import { bigmlRouter } from './core/routes/bigml-router';

const app = express();
const port = 3000;

export const historicalFlightsConsumer = new ConsumerService('historical-flights', config.CLOUDKARAFKA_TOPIC_HISTORICAL);

app.use(json());
app.use(bigmlRouter);

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${ port }`);
  await connectToDB();

  await historicalFlightsConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      saveHistoricalFlight(JSON.parse(message.value.toString()));
    },
  });
});

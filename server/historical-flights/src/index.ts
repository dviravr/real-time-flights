import express from 'express';
import { json } from 'body-parser';
import { config, ConsumerService } from 'real-time-flight-lib';
import { connectToDB } from './services/db.service';
import { saveHistoricalFlight } from './services/histoical-flight.service';
import { bigmlRouter } from './core/routes/bigml-router';
import cors from 'cors';

const app = express();
const port = 5003;

export const historicalFlightsConsumer = new ConsumerService('historical-flights-1', config.CLOUDKARAFKA_TOPIC_HISTORICAL);

app.use(json());
app.use(cors());
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

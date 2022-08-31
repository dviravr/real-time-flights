import express from 'express';
import { json } from 'body-parser';
import { exampleRouter } from './core/routes/example';
import { config, ConsumerService } from 'real-time-flight-lib';
import { connectToDB } from './services/db.service';
import { bigML } from './services/bigML.service';
import { saveHistoricalFlight } from './services/histoical-flight.service';

const app = express();
const port = 3000;

export const historicalFlightsConsumer = new ConsumerService('historical-flights', config.CLOUDKARAFKA_TOPIC_HISTORICAL);

app.use(json());
app.use(exampleRouter);

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${ port }`);
  await connectToDB();
  await bigML();
  // await historicalFlightsConsumer.consumer.run({
  //   eachMessage: async ({ topic, partition, message }) => {
      // saveHistoricalFlight(JSON.parse(message.value.toString()));
    // },
  // });
});

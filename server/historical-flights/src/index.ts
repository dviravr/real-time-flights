import express from 'express';
import { json } from 'body-parser';
import { exampleRouter } from './core/routes/example';
import { config, ConsumerService } from 'real-time-flight-lib';
import { connectToDB } from './services/db.service';
import { saveHistoricalFlight } from './services/histoical-flight.service';
import { createDatafile } from './services/bigML.service';

const app = express();
const port = 3000;

export const historicalFlightsConsumer = new ConsumerService('historical-flights', config.CLOUDKARAFKA_TOPIC_HISTORICAL);

app.use(json());
app.use(exampleRouter);

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${ port }`);
  await connectToDB();
  // createDatafile();

  await historicalFlightsConsumer.consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(JSON.parse(message.value.toString()));
      saveHistoricalFlight(JSON.parse(message.value.toString()));
    },
  });
});


// const bigml = require('bigml');
// const source = new bigml.Source();
// const connection = new bigml.BigML('dviravr', '50193977c80c720a87bb5540867fc84c248e26bc');
//
// source.create('./iris.csv', (error, sourceInfo) => {
//   if (!error && sourceInfo) {
//     const dataset = new bigml.Dataset();
//     dataset.create(sourceInfo, (error, datasetInfo) => {
//       if (!error && datasetInfo) {
//         const model = new bigml.Model();
//         model.create(datasetInfo, (error, modelInfo) => {
//           if (!error && modelInfo) {
//             const prediction = new bigml.Prediction();
//             prediction.create(modelInfo, { 'petal length': 1 });
//           }
//         });
//       }
//     });
//   }
// });





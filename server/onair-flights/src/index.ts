import express from 'express';
import { json } from 'body-parser';
import { client } from './service/redis.service';
import { consumer } from './service/kafka.service';


const app = express();
const port = 5000;

app.use(json());

app.listen(port, async () => {
  await client.connect();

  await consumer.connect();
  await consumer.getMessages();

  return console.log(`Express is listening at http://localhost:${port}`);
});

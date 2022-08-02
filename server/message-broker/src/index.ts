import express from 'express';
import { json } from 'body-parser';
import { ProducerService } from './producer';
import { ConsumerService } from './consumer';
import { Message } from 'kafkajs';
import { producerRouter } from './producer/routes';
import { consumerRouter } from './consumer/routes';

const app = express();
const port = 4000;
export const producer = new ProducerService();
export const consumer = new ConsumerService();

const main = async () => {
  await producer.connect();
  await consumer.connect();

  const messages: Message[] = [
    {
      value: 'hello main',
    },
  ];
  await consumer.getMessages();
  await producer.sendMessages(messages);
};

app.use(json());
app.use(producerRouter);
app.use(consumerRouter);

app.listen(port, async () => {
  console.log(`Express is listening at http://localhost:${ port }`);
  await main();
});

// main().catch(console.error);

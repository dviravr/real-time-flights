import { Consumer } from 'kafkajs';
import { config } from '../config';
import { createKafka } from '../service/kafka.service';

export class ConsumerService {
  consumer: Consumer;

  constructor() {
    this.consumer = createKafka('consumer').consumer({
      groupId: 'redis-consumer',
    });

    this.connectionLogger();
  }

  async connect() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: config.CLOUDKARAFKA_TOPIC_REAL_TIME, fromBeginning: true });
  }

  connectionLogger() {
    this.consumer.on('consumer.connect', () => {
      console.log('KafkaProvider: connected');
    });
    this.consumer.on('consumer.disconnect', () => {
      console.log('KafkaProvider: could not connect');
    });
    this.consumer.on('consumer.network.request_timeout', (payload) => {
      console.log(`KafkaProvider: request timeout ${payload.id}`);
    });
  }

  async getMessages() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(message.value.toString());
        } catch {
          parsedMessage = message.value.toString();
        }
        console.log({
          partition,
          offset: message.offset,
          value: parsedMessage,
        });
      },
    });
  }
}

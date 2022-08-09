import { Consumer } from 'kafkajs';
import { config } from '../config';
import { createKafka } from '../services/kafka.service';
import { saveFlights } from '../services/redis.service';

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
    await this.consumer.subscribe(
        {
          topics:
              [
                config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS,
                config.CLOUDKARAFKA_TOPIC_TAKE_OFF,
              ],
          fromBeginning: true,
        });
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
        if (topic === config.CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS) {
          await saveFlights(message.key.toString(), JSON.parse(message.value.toString()));
        }
      },
    });
  }
}

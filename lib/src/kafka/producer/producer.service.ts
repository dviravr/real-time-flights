import { Message, Partitioners, Producer } from 'kafkajs';
import { createKafka } from '../kafka.service';

export class ProducerService {
  producer: Producer;

  constructor() {
    this.producer = createKafka().producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    this.producer.connect().then();
    this.connectionLogger();
  }

  connectionLogger() {
    this.producer.on('producer.connect', () => {
      console.log('KafkaProvider: connected');
    });
    this.producer.on('producer.disconnect', () => {
      console.log('KafkaProvider: could not connect');
    });
    this.producer.on('producer.network.request_timeout', (payload) => {
      console.log(`KafkaProvider: request timeout ${payload.id}`);
    });
  }

  sendMessages(messages: Message[], topic: string) {
    this.producer.send({
      topic,
      messages,
    }).then().catch((err) => {
      console.log(err);
    });
  }
}

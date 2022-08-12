import { Consumer } from 'kafkajs';
import { createKafka } from '../kafka.service';

export class ConsumerService {
  private _consumer: Consumer;

  constructor(groupId: string, topic: string) {
    this.consumer = createKafka().consumer({
      groupId,
    });

    this.connectionLogger();
    this.connect(topic);
  }

  connect(topic: string) {
    this.consumer.connect().then().catch(err => {
      console.log(err)
    });
    this.consumer.subscribe({ topic, fromBeginning: true }).then().catch(err => {
      console.log(err)
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

  set consumer(consumer: Consumer) {
    this._consumer = consumer;
  }

  get consumer(): Consumer {
    return this._consumer;
  }
}

import { Kafka } from 'kafkajs';
import { config } from '../config';
import { ConsumerService } from '../consumer/consumer';

export const createKafka = (clientId: string) => {
  return new Kafka({
    clientId,
    brokers: config.CLOUDKARAFKA_BROKERS,
    ssl: true,
    logLevel: 2,
    sasl: {
      mechanism: 'scram-sha-256',
      username: config.CLOUDKARAFKA_USERNAME,
      password: config.CLOUDKARAFKA_PASSWORD,
    },
  });
};

export const consumer = new ConsumerService();

import { Kafka } from 'kafkajs';
import { config } from '../config';

export const createKafka = () => {
  return new Kafka({
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

export const config = {
  CLOUDKARAFKA_BROKERS: [
    'rocket-01.srvs.cloudkafka.com:9094',
    'rocket-02.srvs.cloudkafka.com:9094',
    'rocket-03.srvs.cloudkafka.com:9094',
  ],
  CLOUDKARAFKA_USERNAME: 'tyj4rbyg',
  CLOUDKARAFKA_PASSWORD: 'BtD48SiGa2VjYQSttDICSDhTFBO5Of7m',
  CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS: 'tyj4rbyg-on-air-flights',
  CLOUDKARAFKA_TOPIC_JUST_LANDED: 'tyj4rbyg-just-landed',
  CLOUDKARAFKA_TOPIC_TAKE_OFF: 'tyj4rbyg-take-off-flights',
  CLOUDKARAFKA_TOPIC_HISTORICAL: 'tyj4rbyg-historical-flights',
};

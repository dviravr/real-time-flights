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
  FLIGHT_RADAR_SINGLE_FLIGHT_URL: 'https://data-live.flightradar24.com/clickhandler',
  FLIGHT_RADAR_24_URL: 'https://api.flightradar24.com/common/v1/airport.json',
  TLV_AIRPORT_CODE: 'tlv',
  FLIGHT_RADAR_24_TOKEN: 'VmiBN2LbqmkViGhm_zUV5K8NTMGXkwiHMn9yKFDAPYs',
  REQUEST_INTERVAL: 60000, // 60 seconds
};

export const config = {
  CLOUDKARAFKA_BROKERS: [
    'rocket-01.srvs.cloudkafka.com:9094',
    'rocket-02.srvs.cloudkafka.com:9094',
    'rocket-03.srvs.cloudkafka.com:9094',
  ],
  CLOUDKARAFKA_USERNAME: 'tyj4rbyg',
  CLOUDKARAFKA_PASSWORD: 'BtD48SiGa2VjYQSttDICSDhTFBO5Of7m',
  CLOUDKARAFKA_TOPIC_ON_AIR_FLIGHTS: 'tyj4rbyg-on-air',
  CLOUDKARAFKA_TOPIC_JUST_LANDED: 'tyj4rbyg-just-landed',
  CLOUDKARAFKA_TOPIC_TAKE_OFF: 'tyj4rbyg-take-off-flights',
  CLOUDKARAFKA_TOPIC_HISTORICAL: 'tyj4rbyg-historical-flights',
  FLIGHT_RADAR_SINGLE_FLIGHT_URL: 'https://data-live.flightradar24.com/clickhandler',
  FLIGHT_RADAR_24_URL: 'https://api.flightradar24.com/common/v1/airport.json',
  TLV_AIRPORT_CODE: 'tlv',
  FLIGHT_RADAR_24_TOKEN: 'VmiBN2LbqmkViGhm_zUV5K8NTMGXkwiHMn9yKFDAPYs',
  REQUEST_INTERVAL: 60000, // 60 seconds
  MONGO_URI: 'mongodb+srv://historicalFlights:gpb4M8XcRO6iMGBm@cluster0.v0awa.mongodb.net/?retryWrites=true&w=majority',
  REDIS_URL: 'redis://default:Gs01PLNJ4RGcTv1PJdsqNYkMP8PHORVG@redis-14566.c250.eu-central-1-1.ec2.cloud.redislabs.com:14566',
  BIGML_USERNAME: 'HAREL-EZRA',
  BIGML_API_KEY: 'd6601ffef42e4b99171778b01b620687617cb643',
  WEATHER_URL: 'http://api.weatherapi.com/v1/current.json',
  WEATHER_API_KEY: '25f1d1b49c54430b8c4171137222408'
};

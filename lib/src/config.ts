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
  FLIGHT_RADAR_24_TOKEN: 'VmiBN2LbqmkViGhm_zUV5K8NTMGXkwiHMn9yKFDAPYs',
  REQUEST_INTERVAL: 60000, // 60 seconds
  MONGO_URI: 'mongodb+srv://historicalFlights:gpb4M8XcRO6iMGBm@cluster0.v0awa.mongodb.net/?retryWrites=true&w=majority',
  REDIS_URL: 'redis://default:F7hSU7V0rW6jzNLSQghFfIC1IdaTkmgB@redis-16156.c135.eu-central-1-1.ec2.cloud.redislabs.com:16156',
  BIGML_USERNAME: 'DVIRAVR',
  BIGML_API_KEY: '50193977c80c720a87bb5540867fc84c248e26bc',
  WEATHER_URL: 'http://api.weatherapi.com/v1/current.json',
  WEATHER_API_KEY: '8d07f757a89749c0a63194247220809',
  TLV_DETAILS: {
    airport: 'TLV',
    city: 'Tel Aviv',
    country: 'Israel',
  },
  TLV_LOCATION: {
    lat: 32.011379,
    lon: 34.886662,
  }
};

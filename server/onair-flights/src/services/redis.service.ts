import { createClient } from 'redis';
import { config, Flight } from 'real-time-flight-lib';

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const saveFlights = async (flightType: string, flights: { [id: string]: Flight }) => {
  const lastFlights = JSON.parse(await redisClient.get(flightType));
  console.log(Object.keys(flights));
  console.log(Object.keys(lastFlights));

  await redisClient.set(flightType, JSON.stringify(flights));
  console.log('saved!!!');

  const lastFlights1 = JSON.parse(await redisClient.get(flightType));
  console.log(Object.keys(lastFlights1));
};


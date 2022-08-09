import { createClient } from 'redis';
import { Flight } from '../model/flight.model';

export const redisClient = createClient({
  url: 'redis://default:Gs01PLNJ4RGcTv1PJdsqNYkMP8PHORVG@redis-14566.c250.eu-central-1-1.ec2.cloud.redislabs.com:14566',
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


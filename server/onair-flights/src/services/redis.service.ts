import { createClient } from 'redis';
import { config } from 'real-time-flight-lib';

export const redisClient = createClient({
  url: 'redis://default:F7hSU7V0rW6jzNLSQghFfIC1IdaTkmgB@redis-16156.c135.eu-central-1-1.ec2.cloud.redislabs.com:16156',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const saveFlightsByType = async (flightType: string, flights: string[]) => {
  const lastFlights: string[] = JSON.parse(await redisClient.get(flightType));
  console.log(flightType, flights);

  const justLanded = lastFlights?.filter((flightId) => !flights.includes(flightId));
  console.log(justLanded);
  justLanded?.forEach((landed) => redisClient.del(landed));

  await redisClient.set(flightType, JSON.stringify(flights));
};

export const saveFlight = async (flightId: string, flight: string) => {
  await redisClient.set(flightId, flight);
};


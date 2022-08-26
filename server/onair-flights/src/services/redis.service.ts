import { createClient } from 'redis';
import { config } from 'real-time-flight-lib';

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const saveFlightsByType = async (flightType: string, flights: string[]) => {
  const lastFlights: string[] = JSON.parse(await redisClient.get(flightType));

  const justLanded = lastFlights?.filter((flightId) => !flights.includes(flightId));
  console.log(justLanded);
  justLanded?.forEach((landed) => redisClient.del(landed));

  await redisClient.set(flightType, JSON.stringify(flights));
};

export const saveFlight = async (flightId: string, flight: string) => {
  await redisClient.set(flightId, flight);
};


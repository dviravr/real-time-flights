import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://default:Gs01PLNJ4RGcTv1PJdsqNYkMP8PHORVG@redis-14566.c250.eu-central-1-1.ec2.cloud.redislabs.com:14566',
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

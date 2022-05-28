import { createClient } from 'redis';
import dotenv from 'dotenv';
import { RedisDb } from '../classes/RedisDb'

dotenv.config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;


const Redis = async function () {
  const client = createClient({
    password: REDIS_PASSWORD,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  const redis = {
    client() {
      return client;
    },
    lib(libKey, searchIndexes = {}) { 
      return new RedisDb(client, libKey, searchIndexes);
    },
    async clear() {
      await client.flushAll();

      return redis;
    },
    async connect() {
      await client.connect();
    },
    async disconnect() {
      await client.disconnect();

      return redis;
    },
    async quit() {
      return await client.quit();
    },
  };

  return redis;
};

export const redis = await Redis();

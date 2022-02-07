import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

/**
 *
 * @param { Object | string | number } value
 * @return { Object }
 */
const getObjectFromValue = (value) => {
  return typeof value === 'object' ? value : { value };
};

/**
 * @param { object | string | number } value
 * @return {string}
 */
const getStringValue = (value) =>
  JSON.stringify(typeof value === 'object' ? value : { value });

const Redis = async function () {
  const client = createClient({
    password: REDIS_PASSWORD,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  /**
   * @param libKey { string }
   */
  const lib = function (libKey) {
    /**
     * @param { string | number } key
     * @return {string }
     */
    const getFullKey = (key) => `${libKey}:${key}`;

    const searchKey = `idx:${libKey}`;

    return {
      /**
       * @param indexesObject
       * @return { Promise<this> }
       */
      async createIndexes(indexesObject) {
        console.log(`Create index ${searchKey} for ${libKey}`, indexesObject);

        try {
          await client.ft.create(searchKey, indexesObject, {
            ON: 'JSON',
            PREFIX: libKey,
          });
        } catch (e) {
          if (e.message === 'Index already exists') {
            console.log('Index exists already, skipped creation.');
          } else {
            console.error(e);
          }
        }

        return lib;
      },

      /**
       * @param { string } searchText
       * @return {Promise<Array<Entity.data>>}
       */
      async search(searchText) {
        try {
          const searchData = await client.ft.search(searchKey, searchText);

          if (searchData?.documents.length) {
            return searchData.documents.map((d) => d.value);
          }

          return null;
        } catch (e) {
          console.error(e);
        }
      },

      /**
       * @param key { string | number }
       * @param value { object | string | number }
       * @return {Promise<boolean>}
       */
      async has(key) {
        try {
          return await client.exists(getFullKey(key));
        } catch (e) {
          console.error(e);
        }
      },

      /**
       * @param key { string | number }
       * @param value { object | string | number }
       * @return {Promise<this>}
       */
      async add(key, value) {
        const redisKey = getFullKey(key);
        try {
          await client.json.set(redisKey, '$', getObjectFromValue(value));
        } catch (e) {
          console.error(e);
        }

        return lib;
      },

      /**
       * @param keyValues { Array<{ key: number|string, value: object|string|number }> }
       * @return {Promise<this>}
       */
      async multiAdd(keyValues) {
        try {
          const promises = keyValues.map((o) =>
            client.json.set(getFullKey(o.key), '$', getObjectFromValue(o.value))
          );
          await Promise.all(promises);
        } catch (e) {
          console.error(e);
        }

        return lib;
      },

      /**
       * @param key { string | number }
       * @param keyValues { Array<{ key: number|string, value: object|string|number }> }
       * @return {Promise<this>}
       */
      async addHash(key, keyValues) {
        const keyValuesFlat = keyValues.reduce(
          (acc, val) =>
            (acc.push(val.key, getStringValue(val.value)) && acc) || acc,
          []
        );
        await client.hSet(getFullKey(key), ...keyValuesFlat);

        return lib;
      },

      /**
       * @param key { string | number }
       * @return {Promise< null | Object | string | number>}
       */
      async get(key) {
        try {
          return await client.json.get(getFullKey(key));
        } catch (e) {
          console.error(e);
        }
      },

      /**
       * @param key { string | number }
       * @return {Promise<this>}
       */
      async delete(key) {
        try {
          await client.del(getFullKey(key));
        } catch (e) {
          console.error(e);
        }

        return lib;
      },

      async clear() {
        try {
          await client.del(libKey);
        } catch (e) {
          console.error(e);
        }

        return lib;
      },
    };
  };

  const redis = {
    client() {
      return client;
    },
    lib,
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

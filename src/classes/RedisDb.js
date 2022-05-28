import { RedisQueryBuilder } from './RedisQueryBuilder'
// /**
//  * @typedef RedisDb
//  * @type Object
//  * @property { (indexesObject: Record<string, RedisIndexObject>) => Promise<RedisLib> } createIndexes
//  * @property { (searchText: string) => Promise<Entity.data[]> } search
//  * @property { (key: string | number) => Promise<Boolean> } has
//  * @property { (key: string | number, value: object | string | number) => Promise<this> } add
//  * @property { (keyValues: Array<{ key: number|string, value: object|string|number }> ) => Promise<this> } multiAdd
//  * @property { (key: string | number) => Promise< null | Object | string | number> } get
//  * @property { (key: string | number) => Promise<this> } delete
//  * @property { () => Promise<this> } clear
//  */


export class RedisDb {
  constructor (redisClient, libKey, searchIndexes) {
    this.client = redisClient;
    this.libKey = libKey;
    this.searchIndexes = searchIndexes ?? {};
  }

  get searchKey() {
    return `idx:${this.libKey}`;
  }

  /**
  * @param { Object | string | number } value
  * @return { Object }
  */
  static getObjectFromValue = (value) => typeof value === 'object' ? value : { value };

  getFullKey(key) {
    return `${this.libKey}:${key}`;
  }

  createQB() {
    return new RedisQueryBuilder(this, this.searchIndexes);
  }

  async createIndexes(indexesObject) {
    const { client, searchKey, libKey } = this

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

    return this;
  }

  async search(searchText) {
    const { client, searchKey } = this

    try {
      const searchData = await client.ft.search(searchKey, searchText, { LIMIT: {
        from: 0,
        size: 1000000
      } });

      if (searchData?.documents.length) {
        return searchData.documents.map((d) => d.value);
      }
    } catch (e) {
      console.error(e);
    }

    return [];
  }

  async has(key) {
    const redisKey = this.getFullKey(key);
    try {
      return Boolean(await this.client.exists(redisKey));
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  async add(key, value) {
    const redisKey = this.getFullKey(key);
    try {
      await this.client.json.set(redisKey, '$', RedisDb.getObjectFromValue(value));
    } catch (e) {
      console.error(e);
    }

    return this;
  }

  async multiAdd(keyValues) {
    try {
      const promises = keyValues.map(({ key, value }) =>
        this.client.json.set(this.getFullKey(key), '$', RedisDb.getObjectFromValue(value))
      );
      await Promise.all(promises);
    } catch (e) {
      console.error(e);
    }

    return this;
  }

  async get(key) {
    try {
      return await this.client.json.get(this.getFullKey(key));
    } catch (e) {
      console.error(e);
    }
  }

  async delete(key) {
    try {
      await this.client.del(this.getFullKey(key));
    } catch (e) {
      console.error(e);
    }

    return this;
  }

  async clear() {
    try {
      await this.client.del(this.libKey);
    } catch (e) {
      console.error(e);
    }

    return this;
  }
}
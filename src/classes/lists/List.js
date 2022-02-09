import {
  DB,
  getArrayFromObject,
  getDataFromDb,
  getTriggerQueries,
  redis,
  TRIGGERS,
} from '../../utils';
import { dbOperations, FieldTypes } from '../../constants';
import { Entity } from '../entities/Entity';
import { SchemaFieldTypes } from 'redis';
import { redisIndexesMapper } from '../../utils';

/**
 * @typedef RedisIndexObject
 * @type Object
 * @property { string } AS
 * @property { SchemaFieldTypes } type
 */

export class List {
  static MAX_UPLOADED_ENTITIES = 1000;

  /**
   * @abstract
   * @type {string}
   */
  static dbName = '';

  /**
   * @abstract
   * @type { string }
   */
  static dbTable = '';

  /**
   * @abstract
   * @type { Class<Entity> }
   */
  static entityName = Entity;

  /**
   * @type { Record<string, SearchIndex>  }
   */
  static searchIndexes = {};

  constructor() {
    this.libKey = `${this.constructor.dbName}:${this.constructor.dbTable}`;

    /**
     * @type { RedisLib }
     */
    this.lib = redis.lib(this.libKey);
  }

  selectQuery() {
    return `SELECT * FROM \`${this.constructor.dbTable}\``;
  }

  /**
   * @param { number } entityId
   * @return { Promise< Entity | null > }
   */
  async get(entityId) {
    const memoryEntity = await this.lib.get(entityId);

    if (memoryEntity) {
      return new this.constructor.entityName().setDataFromMemory(memoryEntity);
    }

    return null;
  }

  /**
   * @param { Entity } entity
   */
  async insertEntity(entity) {
    await this.lib.add(entity.data.id, entity.data);

    return this;
  }

  /**
   * @param { Array<Entity> } entities
   */
  async insertEntities(entities) {
    await this.lib.multiAdd(
      entities.map((e) => ({ key: e.data.id, value: e.data }))
    );

    return this;
  }

  /**
   * @param { number } entityId
   * @param table { string | null }
   * @param table
   */
  async deleteEntity(entityId, table = null) {
    await this.lib.delete(entityId);

    return this;
  }

  /**
   * @param { Entity } entity
   * @param table
   */
  async updateEntity(entity, table = null) {
    await this.lib.add(entity.data.id, entity.data);

    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   * @return { Array<number> }
   */
  getInsertUpdateIds(changeLogs) {
    return changeLogs.reduce((acc, changeLog) => {
      if (
        [dbOperations.Insert, dbOperations.Update].includes(changeLog.action)
      ) {
        acc.push(changeLog.primaryKey);
      }
      return acc;
    }, []);
  }

  /**
   * @param { Array<ChangeLog> } allChangeLogs
   */
  async update(allChangeLogs = []) {
    const dbTable = this.constructor.dbTable;
    const dbName = this.constructor.dbName;

    const selfChangeLogs = allChangeLogs.filter(
      (c) => c.dbTable === dbTable && c.dbName === dbName
    );

    if (!selfChangeLogs?.length) {
      return this;
    }

    /**
     * @type { Map<number, Entity> }
     */
    const updatedEntities = await this.getEntitiesFromDb(
      {
        query: `SELECT * FROM \`${dbTable}\` WHERE \`id\` IN (?)`,
        prepareParams: this.getInsertUpdateIds(selfChangeLogs),
        dbName,
      },
      this.constructor.entityName
    );

    for await (const changeLog of selfChangeLogs) {
      const { action, primaryKey: entityId } = changeLog;
      switch (action) {
        case dbOperations.Insert:
          if (updatedEntities.has(entityId)) {
            await this.insertEntity(updatedEntities.get(entityId));
          }
          break;
        case dbOperations.Update:
          if (updatedEntities.has(entityId)) {
            await this.updateEntity(updatedEntities.get(entityId));
          }
          break;
        case dbOperations.Delete:
          await this.deleteEntity(entityId);
          break;
      }
    }

    return this;
  }

  async createIndexes() {
    const searchIndexes = this.constructor.searchIndexes;

    if (Object.keys(searchIndexes).length) {
      await this.lib.createIndexes(redisIndexesMapper(searchIndexes));
    }

    return this;
  }

  async fill(db = null) {
    const entitiesFromDb = await getDataFromDb({
      query: this.selectQuery(),
      dbName: this.constructor.dbName,
      db,
    });

    const totalCount = entitiesFromDb.length;
    console.log(`${this.constructor.name}: ${totalCount}`);
    let loaded = 0;

    const entities = entitiesFromDb.map((e) =>
      new this.constructor.entityName().setDataFromDb(e)
    );

    let dynamicEntities = [];
    do {
      dynamicEntities.push(entities.shift());
      if (
        dynamicEntities.length === List.MAX_UPLOADED_ENTITIES ||
        !entities.length
      ) {
        await this.insertEntities(dynamicEntities);
        loaded += dynamicEntities.length;
        process.stdout.write(
          `\rUploaded: ${Math.round((loaded / totalCount) * 100)}%`
        );
        dynamicEntities = [];
      }
    } while (entities.length);
    process.stdout.write('\n\n');

    return this;
  }

  /**
   * @param { DbDataOptions } dbOptions
   * @param { Class<Entity> } className
   * @return { Promise<Map<number, Object>> }
   */
  async getEntitiesFromDb(dbOptions, className) {
    const entitiesDb = await getDataFromDb(dbOptions);

    const retMap = new Map();

    for (const entityDb of entitiesDb) {
      const newClass = new className().setDataFromDb(entityDb);

      retMap.add(newClass.data.id, newClass);
    }

    return retMap;
  }

  async createTriggers() {
    const dbName = this.constructor.dbName;
    const dbTable = this.constructor.dbTable;

    const currentDb = await DB().connect(dbName);

    for (const trigger of getArrayFromObject(TRIGGERS)) {
      const queries = getTriggerQueries({
        trigger,
        dbName,
        dbTable,
      });

      try {
        for (const query of queries) {
          await currentDb.queryWithoutPrepare(query);
        }
      } catch (e) {
        console.error(e);
      }
    }

    await currentDb.disconnect();

    return this;
  }
}

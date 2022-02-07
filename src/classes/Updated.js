import {
  DB,
  getArrayFromObject,
  getDataFromDb,
  getTriggerQueries,
  redis,
  TRIGGERS,
} from '../utils';
import { dbOperations } from '../constants';
import { Entity } from './entities/Entity';
import { SchemaFieldTypes } from 'redis';
import { redisIndexesMapper } from '../utils';

export class Updated {
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
   * @typedef SearchIndex
   * @type Object
   * @property { FieldTypes } type
   */

  /**
   * @type { Object.<string, SearchIndex>  }
   */
  static searchIndexes = {};

  /**
   * @typedef RedisIndexObject
   * @type Object
   * @property { SchemaFieldTypes } type
   * @property { string } AS
   */

  constructor() {
    this.libKey = `${this.constructor.dbName}:${this.constructor.dbTable}`;
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
      return new this.constructor.entityName().setData(memoryEntity);
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

    const changeLogs = allChangeLogs.filter(
      (c) => c.dbTable === dbTable && c.dbName === dbName
    );

    if (!changeLogs?.length) {
      return this;
    }

    /**
     * @type { Map<number, Entity> }
     */
    const updatedEntities = await this.getEntitiesFromDb(
      {
        query: `SELECT * FROM \`${dbTable}\` WHERE \`id\` IN (?)`,
        prepareParams: this.getInsertUpdateIds(changeLogs),
        dbName,
      },
      this.constructor.entityName
    );

    for await (const changeLog of changeLogs) {
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
        dynamicEntities.length === Updated.MAX_UPLOADED_ENTITIES ||
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

  async createTriggers(db = null) {
    const dbName = this.constructor.dbName;
    const dbTables = getArrayFromObject(this.constructor.dbTables);

    if (dbTables.length) {
      const currentDb = db ?? (await DB().connect(dbName));

      for (const dbTable of dbTables) {
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
      }

      if (!db) {
        await currentDb.disconnect();
      }
    }

    return this;
  }
}
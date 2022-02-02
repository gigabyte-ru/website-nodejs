import {
  DB,
  getArrayFromObject,
  getDataFromDb,
  getTriggerQueries,
  TRIGGERS,
} from '../utils';
import { dbOperations } from '../constants';
import { Translation } from './entities';

export class Updated {
  /**
   * @abstract
   * @type {string}
   */
  static dbName = '';

  /**
   * @abstract
   * @type { Object.<string, string> }
   */
  static dbTables = {};

  /**
   * @typedef TablesChangeLogs
   * @type { Object.<string, Array<ChangeLog>> }
   */

  /**
   * @type { TablesChangeLogs }
   */
  tablesChangeLogs = {};

  /**
   * @abstract
   * @param {any} entity
   * @param { string | null } table
   * @return this
   */
  updateEntity(entity, table = null) {
    return this;
  }

  /**
   * @abstract
   * @param {any} entity
   * @param { string | null } table
   * @return this
   */
  insertEntity(entity, table = null) {
    return this;
  }

  /**
   * @abstract
   * @param {any} entity
   * @param { string | null } table
   * @return this
   */
  deleteEntity(entity, table = null) {
    return this;
  }

  /**
   * @abstract
   * @param {number} entityId
   * @param { string | null } table
   * @return this
   */
  deleteEntityById(entityId, table = null) {
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
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    this.tablesChangeLogs = Object.keys(this.constructor.dbTables).reduce(
      (tablesAcc, key) => {
        const dbTable = this.constructor.dbTables[key];
        const dbName = this.constructor.dbName;

        tablesAcc[key] = changeLogs.filter(
          (c) => c.dbName === dbName && c.dbTable === dbTable
        );

        return tablesAcc;
      },
      {}
    );
    console.log(this.tablesChangeLogs);

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
      const newClass = new className(entityDb);

      retMap.add(newClass.id, newClass);
    }

    return retMap;
  }

  /**
   * @typedef UpdateDbTableOptions
   * @type Object
   * @property { string } dbName
   * @property { string } table
   */

  /**
   * @param { UpdateDbTableOptions } options
   */
  async updateDbTableEntities({ dbName, table }) {
    const changeLogs = this.tablesChangeLogs[table];

    if (!changeLogs?.length) {
      return this;
    }

    /**
     * @type { Map<number, Translation> }
     */
    const updatedEntities = await this.getEntitiesFromDb(
      {
        query: `SELECT * FROM \`${table}\` WHERE \`id\` IN (?)`,
        prepareParams: this.getInsertUpdateIds(changeLogs),
        dbName,
      },
      Translation
    );

    for (const changeLog of changeLogs) {
      const { action, primaryKey: entityId } = changeLog;
      switch (action) {
        case dbOperations.Insert:
          if (updatedEntities.has(entityId)) {
            this.insertEntity(updatedEntities.get(entityId), table);
          }
          break;
        case dbOperations.Update:
          if (updatedEntities.has(entityId)) {
            this.updateEntity(updatedEntities.get(entityId), table);
          }
          break;
        case dbOperations.Delete:
          this.deleteEntityById(entityId, table);
          break;
      }
    }

    return this;
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

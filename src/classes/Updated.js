import { DB, getArrayFromObject, getTriggerQueries, TRIGGERS } from '../utils';

export class Updated {
  static dbName = '';
  static dbTables = [];
  static dbOperations = {
    Insert: 'insert',
    Delete: 'delete',
    Update: 'update',
  };

  /**
   * @typedef ChangeLogEntities
   * @type {object}
   * @property {Array<number>} insert - id's for insert
   * @property {Array<number>} delete - id's for delete
   * @property {Array<number>} update - id's for update
   */

  /**
   * @type { Object.<string, ChangeLogEntities> }
   */
  changeLogs = {};

  /**
   *
   * @param { Array<ChangeLog> } changeLogs
   */
  update(changeLogs = []) {
    this.changeLogs = Object.keys(this.constructor.dbTables).reduce(
      (tablesAcc, key) => {
        const dbTable = this.constructor.dbTables[key];
        const dbName = this.constructor.dbName;
        console.log({ dbTable, dbName });

        const filterChangeLogs = changeLogs.filter(
          (c) => c.dbName === dbName && c.dbTable === dbTable
        );

        console.log('filterChangeLogs: ', filterChangeLogs);

        tablesAcc[key] = {
          [Updated.dbOperations.Insert]: new Set(),
          [Updated.dbOperations.Update]: new Set(),
          [Updated.dbOperations.Delete]: new Set(),
        };

        for (const changeLog of filterChangeLogs) {
          if (changeLog.action in tablesAcc[key]) {
            tablesAcc[key][changeLog.action].add(changeLog.primaryKey);
          }
        }

        console.log(`tablesAcc[${key}]: `, tablesAcc[key]);

        tablesAcc[key][Updated.dbOperations.Insert] = Array.from(
          tablesAcc[key][Updated.dbOperations.Insert]
        );
        tablesAcc[key][Updated.dbOperations.Update] = Array.from(
          tablesAcc[key][Updated.dbOperations.Update]
        );
        tablesAcc[key][Updated.dbOperations.Delete] = Array.from(
          tablesAcc[key][Updated.dbOperations.Delete]
        );

        return tablesAcc;
      },
      {}
    );
    console.log(this.changeLogs);

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

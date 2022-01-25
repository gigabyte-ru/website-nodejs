import { DB, getArrayFromObject, getTriggerQueries, TRIGGERS } from '../utils';

export class Updated {
  static dbName = '';
  static dbTables = [];

  updatedAt = new Date();

  update() {
    this.updatedAt = new Date();

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

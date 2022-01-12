import { DB } from '../utils/index.js';

export class Updated {
  updatedAt = new Date();

  update() {
    this.updatedAt = new Date();

    return this;
  }

  async getDataFromDb({ query, prepareParams = [], dbName, db = null }) {
    const currentDb = db ?? (await DB().connect(dbName));
    const data = await currentDb.query(query, prepareParams);

    if (!db) {
      await currentDb.disconnect();
    }

    return data ?? [];
  }
}

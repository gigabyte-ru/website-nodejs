import { DB } from './db.js';

/**
 * @typedef DbDataOptions
 * @type { Object }
 * @property { string } query - Query string
 * @property { Array<string | number> } prepareParams - preparing params for Query,
 * @property { string } dbName - database name
 * @property { DB | null } db - database class,
 */

/**
 * @param { DbDataOptions } dbDataOptions
 * @return { Promise<Array<Object>> }
 */
export const getDataFromDb = async (dbDataOptions) => {
  const { query, prepareParams = [], dbName, db = null } = dbDataOptions;

  try {
    const currentDb = db ?? (await DB().connect(dbName));
    const data = await currentDb.query(query, prepareParams);

    if (!db) {
      await currentDb.disconnect();
    }

    return data ?? [];
  } catch (e) {
    console.error(e);
  }
};

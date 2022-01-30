import { DB } from './db.js';

export const getDataFromDb = async ({
  query,
  prepareParams = [],
  dbName,
  db = null,
}) => {
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

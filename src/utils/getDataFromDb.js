import { DB } from './db.js';

export const getDataFromDb = async ({
  query,
  prepareParams = [],
  dbName,
  db = null,
}) => {
  const currentDb = db ?? (await DB().connect(dbName));
  const data = await currentDb.query(query, prepareParams);

  if (!db) {
    await currentDb.disconnect();
  }

  return data ?? [];
};

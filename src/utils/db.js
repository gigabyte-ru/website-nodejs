import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
export const DB = () => {
  let connection = null;
  let error = null;

  const db = {
    async connect(DB_DATABASE = 'u15821_global') {
      try {
        connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          database: DB_DATABASE,
          password: process.env.DB_PASS,
          port: process.env.DB_PORT,
        });
      } catch(e) {
        error = e
      }

      return db;
    },
    async disconnect() {
      return await connection?.end();
    },
    async query(query, prepareParams = []) {
      try {
        const result = await connection?.execute(query, prepareParams);

        return result[0];
      } catch(e) {
        error = e
      }

      return null;
    },
    async queryWithoutPrepare(query) {
      try {
        const result = await connection?.query(query);

        return result[0];
      } catch(e) {
        error = e
      }

      return null;
    },
  };

  return db;
};

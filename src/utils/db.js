import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()
export const DB = () => {
  let connection = null;

  const db = {
    async connect(DB_DATABASE = 'u15821_global') {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: DB_DATABASE,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
      });

      return db
    },
    async disconnect() {
      return await connection?.end()
    },
    async query(query, prepareParams = []) {
      const result = await connection.execute(query, prepareParams);

      return result[0]
    },
  }

  return db
}

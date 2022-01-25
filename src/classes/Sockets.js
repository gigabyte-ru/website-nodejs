import { Updated } from './Updated';
import { Socket } from './entities';
import { getDataFromDb } from '../utils';

export class Sockets extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    sockets: 'sockets',
  };

  data = new Map();

  get(socketId) {
    return this.data.get(socketId) ?? null;
  }

  async fill(db = null) {
    this.data = new Map();

    const socketsDb = await getDataFromDb({
      query: `SELECT * FROM \`${Sockets.dbTables.sockets}\``,
      dbName: Sockets.dbName,
      db,
    });

    for (const socketDb of socketsDb) {
      const socket = new Socket(socketDb);
      this.data.set(socket.id, socket);
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

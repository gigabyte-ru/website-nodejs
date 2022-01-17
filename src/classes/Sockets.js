import { Updated } from './Updated.js';
import { Socket } from './entities/Socket.js';

export class Sockets extends Updated {
  static dbName = 'u15821_products';

  data = new Map();

  get(socketId) {
    return this.data.get(socketId) ?? null;
  }

  async fill(db = null) {
    this.data = new Map();

    const socketsDb = await this.getDataFromDb({
      query: 'SELECT * FROM `sockets`',
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

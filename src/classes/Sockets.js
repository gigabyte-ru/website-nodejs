import { Updated } from './Updated';
import { Socket } from './entities';
import { getDataFromDb } from '../utils';

export class Sockets extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    sockets: 'sockets',
  };

  /**
   * @type { Map<Socket> }
   */
  data = new Map();

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  get(socketId) {
    return this.data.get(socketId) ?? null;
  }

  deleteEntityById(entityId, table) {
    for (const entity of this.data.values()) {
      if (entity.id === entityId) {
        this.deleteEntity(entity);
      }
    }

    return this;
  }

  /**
   * @param {Socket} entity
   * @param table
   */
  insertEntity(entity, table = null) {
    if (!this.data.has(entity.id)) {
      this.data.set(entity.id, entity);
    }
    return this;
  }

  /**
   * @param {Socket} entity
   * @param table
   */
  deleteEntity(entity, table = null) {
    this.data.delete(entity.id);
    return this;
  }

  /**
   * @param {Socket} entity
   * @param table
   */
  updateEntity(entity, table = null) {
    this.data.set(entity.id, entity);
    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    await super.update(changeLogs);

    await this.updateDbTableEntities({
      dbName: Sockets.dbName,
      table: Sockets.dbTables.langs,
    });

    return this;
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
}

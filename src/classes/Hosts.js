import { Updated } from './Updated';
import { Host } from './entities';
import { getDataFromDb } from '../utils';

export class Hosts extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    domains: 'domains',
  };

  /**
   * @type { Map<string, Host> }
   */
  data = new Map();

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  get(hostname) {
    return this.data.get(hostname);
  }

  /**
   * @param {Host} entity
   * @param {string | null} table
   */
  insertEntity(entity, table = null) {
    if (!this.data.has(entity.name)) {
      this.data.set(entity.name, entity);
    }
    return this;
  }

  /**
   * @param {Host} entity
   * @param {string | null} table
   */
  deleteEntity(entity, table = null) {
    this.data.delete(entity.name);
    return this;
  }

  /**
   * @param {Host} entity
   * @param {string | null} table
   */
  updateEntity(entity, table = null) {
    this.data.set(entity.name, entity);
    return this;
  }

  deleteEntityById(entityId, table) {
    for (const host of this.data.values()) {
      if (host.id === entityId) {
        this.deleteEntity(host);
      }
    }

    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    await super.update(changeLogs);

    await this.updateDbTableEntities({
      dbName: Hosts.dbName,
      table: Hosts.dbTables.domains,
    });

    return this;
  }

  async fill(db = null) {
    this.data = new Map();

    const domainsDb = await getDataFromDb({
      query: `SELECT * FROM \`${Hosts.dbTables.domains}\``,
      dbName: Hosts.dbName,
      db,
    });

    for (const domain of domainsDb) {
      this.insertEntity(new Host(domain));
    }

    this.insertEntity(
      new Host({
        lang_id: 1,
        vicarial_lang_id: 1,
        default_lang_id: 1,
        name: 'localhost:3020',
        country_id: 47,
      })
    );

    return this;
  }
}

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

  get(hostname) {
    return this.data.get(hostname);
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

  /**
   * @param {Host} host
   */
  insertEntity(host) {
    this.data.set(host.name, host);
    return this;
  }

  /**
   * @param {Host} host
   */
  deleteEntity(host) {
    this.data.delete(host.name);
    return this;
  }

  /**
   * @param {Host} host
   */
  updateEntity(host) {
    this.deleteEntity(host);
    this.insertEntity(host);
    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  update(changeLogs = []) {
    super.update(changeLogs);

    this.updateHosts(this.changeLogs[Hosts.dbTables.domains]).then();

    return this;
  }

  /**
   * @param { ChangeLogEntities } changeLogsEntities
   */
  async updateHosts(changeLogsEntities) {
    const {
      insert: insertIds,
      update: updateIds,
      delete: deleteIds,
    } = changeLogsEntities;
    const insertUpdateIds = [...insertIds, ...updateIds];

    if (insertUpdateIds.length) {
      /**
       * @type { Array<Host> }
       */
      const hosts = (
        await getDataFromDb({
          query: `SELECT * FROM \`${Hosts.dbTables.domains}\` WHERE \`id\` IN (?)`,
          prepareParams: insertUpdateIds,
          dbName: Hosts.dbName,
        })
      ).map((a) => new Host(a));

      for (const host of hosts) {
        console.log(`Update/insert host ${host.name} `);

        this.updateEntity(host);
      }
    }

    for (const deleteId of deleteIds) {
      for (const host of this.data.values()) {
        if (host.id === deleteId) {
          console.log(`Delete host '${host.name}'`);

          this.deleteEntity(host);
        }
      }
    }
  }
}

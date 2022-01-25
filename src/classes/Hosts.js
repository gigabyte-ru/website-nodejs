import { Updated } from './Updated';
import { Host } from './entities';
import { getDataFromDb } from '../utils';

export class Hosts extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    domains: 'domains',
  };

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
      const host = new Host(domain);
      this.data.set(host.name, host);
    }

    this.data.set(
      'localhost:3020',
      new Host({
        lang_id: 1,
        vicarial_lang_id: 1,
        default_lang_id: 1,
        name: 'Localhost',
        country_id: 47,
      })
    );

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

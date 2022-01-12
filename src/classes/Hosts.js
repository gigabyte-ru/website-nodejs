import { Updated } from './Updated.js';
import { Host } from './Host.js';

export class Hosts extends Updated {
  static dbName = 'u15821_global';

  data = new Map();

  get(hostname) {
    return this.data.get(hostname);
  }

  async fill(db = null) {
    this.data = new Map();

    const domainsDb = await this.getDataFromDb({
      query: 'SELECT * FROM `domains`',
      dbName: Hosts.dbName,
      db,
    });

    for (const domain of domainsDb) {
      const host = new Host(domain);
      this.data.set(host.name, host);
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

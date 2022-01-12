import { Updated } from './Updated.js';
import { DB } from '../utils/db.js';
import { Host } from './Host.js';

export class Hosts extends Updated {
  data = new Map();

  get(hostname) {
    return this.data.get(hostname);
  }

  async fill() {
    this.data = new Map();

    const domainsDb = await this.getDataFromDb();

    for (const domain of domainsDb) {
      this.data.set(domain['name'], new Host(domain));
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_global');
    const data = await db.query('SELECT * FROM `domains`');
    await db.disconnect();

    console.log('Hosts: ', data.length);

    return data;
  }
}

import { Updated } from './updated.js';
import { DB } from '../utils/db.js';

export class Hosts extends Updated {
  data = new Map();

  getHostByName (hostname) {
    return this.data.get(hostname);
  }

  async fill() {
    this.data = new Map();

    const domainsDb = await this.getDataFromDb();

    for (const domain of domainsDb) {
      const host = {
        firstLangId: domain['lang_id'],
        secondLangId: domain['vicarial_lang_id'],
        defaultLangId: domain['default_lang_id'],
        name: domain['name'],
        countryId: domain['country_id'],
      };

      this.data.set(domain['name'], host);
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

import { Updated } from './Updated.js';
import { Country } from './Country.js';
import { DB } from '../utils/db.js';

export class Countries extends Updated {
  static dbName = 'u15821_geo';

  data = new Map();

  get(countryId) {
    return this.data.get(countryId);
  }

  async fill() {
    this.data = new Map();

    const countries = await this.getDataFromDb();

    for (const country of countries) {
      this.data.set(country.id, new Country(country));
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect(Countries.dbName);
    const data = await db.query('SELECT * FROM `countries`');
    await db.disconnect();

    console.log('Countries: ', data.length);

    return data;
  }
}

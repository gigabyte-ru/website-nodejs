import { Updated } from './Updated.js';
import { Country } from './Country.js';

export class Countries extends Updated {
  static dbName = 'u15821_geo';

  data = new Map();

  get(countryId) {
    return this.data.get(countryId);
  }

  async fill(db = null) {
    this.data = new Map();

    const countriesDb = await this.getDataFromDb({
      query: 'SELECT * FROM `countries`',
      dbName: Countries.dbName,
      db,
    });

    for (const countryDb of countriesDb) {
      const country = new Country(countryDb);
      this.data.set(country.id, country);
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

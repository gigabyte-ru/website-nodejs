import { Updated } from './Updated';
import { Country } from './entities';
import { getDataFromDb } from '../utils';

export class Countries extends Updated {
  static dbName = 'u15821_geo';
  static dbTables = {
    countries: 'countries',
  };

  /**
   * @type { Map<number, Country> }
   */
  data = new Map();

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  get(countryId) {
    return this.data.get(countryId);
  }

  deleteEntityById(entityId, table = null) {
    const entity = this.get(entityId);

    if (entity) {
      this.deleteEntity(entity);
    }

    return this;
  }

  /**
   * @param {Country} entity
   * @param table
   * @return {Countries}
   */
  insertEntity(entity, table = null) {
    if (!this.data.has(entity.id)) {
      this.data.set(entity.id, entity);
    }
    return this;
  }

  /**
   * @param {Country} entity
   * @param table
   * @return {Countries}
   */
  updateEntity(entity, table = null) {
    this.data.set(entity.id, entity);

    return this;
  }

  /**
   * @param {Country} entity
   * @param table
   * @return {Countries}
   */
  deleteEntity(entity, table = null) {
    this.data.delete(entity.id);

    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    await super.update(changeLogs);

    await this.updateDbTableEntities({
      dbName: Countries.dbName,
      table: Countries.dbTables.countries,
    });

    return this;
  }

  async fill(db = null) {
    this.data = new Map();

    const countriesDb = await getDataFromDb({
      query: `SELECT * FROM \`${Countries.dbTables.countries}\``,
      dbName: Countries.dbName,
      db,
    });

    for (const countryDb of countriesDb) {
      const country = new Country(countryDb);
      this.data.set(country.id, country);
    }

    return this;
  }
}

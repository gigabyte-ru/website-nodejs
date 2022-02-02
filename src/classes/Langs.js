import { Updated } from './Updated';
import { Lang } from './entities';
import { getDataFromDb } from '../utils';

export class Langs extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    langs: 'langs',
  };

  /**
   * @type { Map<number, Lang> }
   */
  data = new Map();

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }

  get(langId) {
    return this.data.get(langId);
  }

  deleteEntityById(entityId, table) {
    this.data.delete(entityId);

    return this;
  }

  /**
   * @param {Lang} entity
   * @param table
   */
  insertEntity(entity, table = null) {
    if (!this.data.has(entity.id)) {
      this.data.set(entity.id, entity);
    }
    return this;
  }

  /**
   * @param {Lang} entity
   * @param table
   */
  deleteEntity(entity, table = null) {
    this.data.delete(entity.id);
    return this;
  }

  /**
   * @param {Lang} entity
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
      dbName: Langs.dbName,
      table: Langs.dbTables.langs,
    });

    return this;
  }

  async fill(db = null) {
    this.data = new Map();

    const langsDb = await getDataFromDb({
      query: `SELECT * FROM \`${Langs.dbTables.langs}\``,
      dbName: Langs.dbName,
      db,
    });

    for (const langDb of langsDb) {
      this.insertEntity(new Lang(langDb));
    }

    return this;
  }
}

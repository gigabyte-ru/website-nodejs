import { Updated } from './Updated';
import { Langs } from './Langs';
import { Translation } from './entities';
import { getDataFromDb } from '../utils';

export class Translations extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    articles: 'articles',
  };

  /**
   * @type { Map<number, Map<string|number, Translation>> }
   */
  data = new Map();

  /**
   * @type { Map<number, Translation> }
   */
  dataMapId = new Map();

  constructor(langs = new Langs()) {
    super();

    this.langs = langs;
  }

  log() {
    let size = 0;
    for (const lang of this.data.values()) {
      size += lang.size;
    }
    console.log(`${this.constructor.name}: ${size}`);
    return this;
  }

  get(langId) {
    return this.data.get(langId);
  }

  /**
   * @param { Translation } entity
   * @param {string | null} table
   */
  insertEntity(entity, table = null) {
    const dataMap = this.data.get(entity.langId);

    if (!dataMap) {
      return this;
    }

    dataMap.set(entity.articleId, entity);

    if (entity.alias) {
      dataMap.set(entity.alias, entity);
    }

    this.dataMapId.set(entity.id, entity);

    return this;
  }

  /**
   * @param {Translation} entity
   * @param table
   */
  deleteEntity(entity, table = null) {
    const dataMap = this.data.get(entity.langId);

    dataMap.delete(entity.articleId);

    if (entity.alias) {
      dataMap.delete(entity.alias);
    }

    this.dataMapId.delete(entity.id);

    return this;
  }

  /**
   * @param {Translation} entity
   * @param {string | null} table
   */
  updateEntity(entity, table = null) {
    this.insertEntity(entity);

    return this;
  }

  /**
   * @param {number} entityId
   * @param {string | null} table
   */
  deleteEntityById(entityId, table = null) {
    const entity = this.dataMapId.get(entityId);

    if (entity) {
      this.deleteEntity(entity);
    }

    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  async update(changeLogs = []) {
    await super.update(changeLogs);

    await this.updateDbTableEntities({
      dbName: Translations.dbName,
      table: Translations.dbTables.articles,
    });

    return this;
  }

  async fill(db = null) {
    this.data = new Map();

    const articles = await getDataFromDb({
      query: `SELECT * FROM \`${Translations.dbTables.articles}\``,
      dbName: Translations.dbName,
      db,
    });

    for (const langId of this.langs.data.keys()) {
      this.data.set(langId, new Map());
    }

    for (const articleDb of articles) {
      const dataMap = this.data.get(articleDb['lang_id']);

      if (!dataMap) {
        continue;
      }

      this.insertEntity(new Translation(articleDb));
    }

    return this;
  }
}

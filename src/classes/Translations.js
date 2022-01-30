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

  constructor(langs = new Langs()) {
    super();

    this.langs = langs;
  }

  get(langId) {
    return this.data.get(langId);
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

  /**
   * @param { Translation } translation
   */
  insertEntity(translation) {
    const dataMap = this.data.get(translation.langId);

    if (!dataMap) {
      return this;
    }

    dataMap.set(translation.articleId, translation);

    if (translation.alias) {
      dataMap.set(translation.alias, translation);
    }

    return this;
  }

  /**
   * @param {Translation} translation
   */
  deleteEntity(translation) {
    const dataMap = this.data.get(translation.langId);

    dataMap.delete(translation.articleId);

    if (translation.alias) {
      dataMap.delete(translation.alias);
    }

    return this;
  }

  /**
   * @param {Translation} translation
   */
  updateEntity(translation) {
    this.deleteEntity(translation);
    this.insertEntity(translation);
    return this;
  }

  log() {
    let size = 0;
    for (const lang of this.data.values()) {
      size += lang.size;
    }
    console.log(`${this.constructor.name}: ${size}`);
    return this;
  }

  /**
   * @param { Array<ChangeLog> } changeLogs
   */
  update(changeLogs = []) {
    super.update(changeLogs);

    this.updateArticles(this.changeLogs[Translations.dbTables.articles]).then();

    return this;
  }

  /**
   * @param { ChangeLogEntities } changeLogsEntities
   */
  async updateArticles(changeLogsEntities) {
    const {
      insert: insertIds,
      update: updateIds,
      delete: deleteIds,
    } = changeLogsEntities;
    const insertUpdateIds = [...insertIds, ...updateIds];

    if (insertUpdateIds.length) {
      /**
       * @type { Array<Translation> }
       */
      const articles = (
        await getDataFromDb({
          query: `SELECT * FROM \`${Translations.dbTables.articles}\` WHERE \`id\` IN (?)`,
          prepareParams: insertUpdateIds,
          dbName: Translations.dbName,
        })
      ).map((a) => new Translation(a));

      for (const article of articles) {
        console.log(`Update/insert article ${article.id} `);

        this.updateEntity(article);
      }
    }

    for (const langMap of this.data.values()) {
      for (const article of langMap.values()) {
        if (deleteIds.includes(article.id)) {
          console.log(`Delete article ${article}`);

          this.deleteEntity(article);
        }
      }
    }
  }
}

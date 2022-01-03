import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Langs } from './langs.js';

export class Translations extends Updated {
  data = {};

  constructor(langs = new Langs()) {
    super();

    this.langs = langs;
  }

  async fill() {
    this.data = {};

    const articles = await this.getDataFromDb();

    for (const lang of this.langs.data.values()) {
      this.data[lang.alias] = new Map();
    }

    for (const article of articles) {
      const langAlias = this.langs.getAliasFromId(article['lang_id']);
      const dataMap = this.data[langAlias];

      if (!dataMap) {
        continue;
      }

      const alias = {
        name: article.name,
        abstract: article.abstract,
        description: article.description,
        code: article.code,
        link: article.link,
      };
      if (article['alias']) {
        dataMap.set(article['alias'], alias);
      }

      dataMap.set(article['article_id'], alias);
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_global');
    const data = await db.query('SELECT * FROM `articles`');
    await db.disconnect();

    return data;
  }
}

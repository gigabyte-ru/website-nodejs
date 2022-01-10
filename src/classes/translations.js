import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Langs } from './langs.js';
import { Translation } from './translation.js';

export class Translations extends Updated {
  data = new Map();

  constructor(langs = new Langs()) {
    super();

    this.langs = langs;
  }

  get(langId) {
    return this.data.get(langId);
  }

  async fill() {
    this.data = new Map();

    const articles = await this.getDataFromDb();

    for (const langId of this.langs.data.keys()) {
      this.data.set(langId, new Map());
    }

    for (const articleDb of articles) {
      const dataMap = this.data.get(articleDb['lang_id']);

      if (!dataMap) {
        continue;
      }

      const translation = new Translation(articleDb);

      if (translation.alias) {
        dataMap.set(translation.alias, translation);
      }

      dataMap.set(translation.id, translation);
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_global');
    const data = await db.query('SELECT * FROM `articles`');
    await db.disconnect();

    console.log('Translations: ', data.length);

    return data;
  }
}

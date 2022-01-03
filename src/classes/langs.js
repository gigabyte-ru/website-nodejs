import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Lang } from './lang.js';

export class Langs extends Updated {
  data = new Map();

  getAliasFromId(langId) {
    return this.data.get(langId)?.alias;
  }

  async fill() {
    this.data = new Map();

    const langs = await this.getDataFromDb();

    this.data = langs.reduce(
      (map, lang) => map.set(lang.id, new Lang(lang)),
      new Map()
    );

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_global');
    const data = await db.query('SELECT * FROM `langs`');
    await db.disconnect();

    return data;
  }
}

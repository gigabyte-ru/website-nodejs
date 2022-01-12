import { Updated } from './Updated.js';
import { DB } from '../utils/db.js';
import { Lang } from './Lang.js';

export class Langs extends Updated {
  data = new Map();

  get(langId) {
    return this.data.get(langId);
  }

  async fill() {
    this.data = new Map();

    const langs = await this.getDataFromDb();

    for (const lang of langs) {
      this.data.set(lang.id, new Lang(lang));
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_global');
    const data = await db.query('SELECT * FROM `langs`');
    await db.disconnect();

    console.log('Langs: ', data.length);

    return data;
  }
}

import { Updated } from './Updated.js';
import { Lang } from './entities/Lang.js';

export class Langs extends Updated {
  static dbName = 'u15821_global';

  data = new Map();

  get(langId) {
    return this.data.get(langId);
  }

  async fill(db = null) {
    this.data = new Map();

    const langsDb = await this.getDataFromDb({
      query: 'SELECT * FROM `langs`',
      dbName: Langs.dbName,
      db,
    });

    for (const langDb of langsDb) {
      const lang = new Lang(langDb);
      this.data.set(lang.id, lang);
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

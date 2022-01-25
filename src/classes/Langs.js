import { Updated } from './Updated';
import { Lang } from './entities';
import { getDataFromDb } from '../utils';

export class Langs extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    langs: 'langs',
  };

  data = new Map();

  get(langId) {
    return this.data.get(langId);
  }

  async fill(db = null) {
    this.data = new Map();

    const langsDb = await getDataFromDb({
      query: `SELECT * FROM \`${Langs.dbTables.langs}\``,
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

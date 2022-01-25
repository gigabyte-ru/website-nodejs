import { Updated } from './Updated';
import { Langs } from './Langs';
import { Translation } from './entities';
import { getDataFromDb } from '../utils';

export class Translations extends Updated {
  static dbName = 'u15821_global';
  static dbTables = {
    articles: 'articles',
  };

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

      const translation = new Translation(articleDb);

      if (translation.alias) {
        dataMap.set(translation.alias, translation);
      }

      dataMap.set(translation.id, translation);
    }

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
}

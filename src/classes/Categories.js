import { Updated } from './Updated';
import { Category } from './entities';
import { getDataFromDb } from '../utils';

export class Categories extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    categories: 'categories',
  };

  data = new Set();

  get(categoryIdOrAlias) {
    for (const category of this.data.values()) {
      if (
        category.id === categoryIdOrAlias ||
        category.alias === categoryIdOrAlias
      ) {
        return category;
      }
    }

    return null;
  }

  async fill(db = null) {
    this.data = new Set();

    const categories = await getDataFromDb({
      query: `SELECT * FROM \`${Categories.dbTables.categories}\` WHERE \`original_id\` > 0`,
      dbName: Categories.dbName,
      db,
    });

    for (const category of categories) {
      this.data.add(new Category(category));
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

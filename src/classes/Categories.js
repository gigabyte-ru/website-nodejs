import { Updated } from './Updated.js';
import { Category } from './entities/Category.js';

export class Categories extends Updated {
  static dbName = 'u15821_products';

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

    const categories = await this.getDataFromDb({
      query: 'SELECT * FROM `categories` WHERE `original_id` > 0',
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

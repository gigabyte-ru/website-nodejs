import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Category } from './category.js';

export class Categories extends Updated {
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

  async fill() {
    this.data = new Set();

    const categories = await this.getDataFromDb();

    for (const category of categories) {
      this.data.add(new Category(category));
    }

    return this;
  }

  async getDataFromDb() {
    const db = await DB().connect('u15821_products');
    const data = await db.query(
      'SELECT * FROM `categories` WHERE `original_id` > 0'
    );
    await db.disconnect();

    console.log('Categories: ', data.length);

    return data;
  }
}

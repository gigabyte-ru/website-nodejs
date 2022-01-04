import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Category } from './category.js';

export class Categories extends Updated {
  data = new Map();

  getOriginalAliasFromId(categoryId) {
    return this.data.get(categoryId)?.originalAlias;
  }

  getAliasFromId(categoryId) {
    return this.data.get(categoryId)?.alias;
  }

  async fill() {
    this.data = new Map();

    const categories = await this.getDataFromDb();

    for (const category of categories) {
      this.data.set(category.id, new Category(category));
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

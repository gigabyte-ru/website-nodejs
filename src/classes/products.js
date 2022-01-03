import { Updated } from './updated.js';
import { DB } from '../utils/db.js';
import { Categories } from './categories.js';

export class Products extends Updated {
  data = {};

  dbName = 'u15821_products';

  constructor(categories = new Categories()) {
    super();

    this.categories = categories;
  }

  async fill() {
    this.data = {};

    for (const category of this.categories.data.values()) {
      this.data[category.originalAlias] = new Map();
    }

    // Open connection
    const db = await DB().connect(this.dbName);
    const products = await this.getDataFromDb(db);

    for (const productDb of products) {
      const categoryAlias = this.categories.getOriginalAliasFromId(
        productDb['category_id']
      );

      const category = this.data[categoryAlias];

      if (!category) {
        continue;
      }

      const product = { ...productDb };

      product['images'] = await this.getProductImages(productDb['id'], db);
      category.set(product['original_alias'], product);
    }

    // Close connection
    await db.disconnect();

    return this;
  }

  async getDataFromDb(db = null) {
    const currentDb = db ?? (await DB().connect(this.dbName));
    const data = await currentDb.query(
      'SELECT * FROM `categories` WHERE `original_id` > 0'
    );
    if (!db) {
      await currentDb.disconnect();
    }

    return data;
  }

  async getProductImages(productId, db = null) {
    const currentDb = db ?? (await DB().connect(this.dbName));
    const data = await currentDb.query(
      'SELECT * FROM `product_images_originals` WHERE `product_id` = ?',
      [productId]
    );

    if (!db) {
      await currentDb.disconnect();
    }

    return data;
  }
}

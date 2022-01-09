import { Updated } from './updated.js';
import { DB } from '../utils/index.js';
import { Categories } from './categories.js';
import { Product } from './product.js';

export class Products extends Updated {
  data = new Map();

  dbName = 'u15821_products';

  constructor(categories = new Categories()) {
    super();

    this.categories = categories;
  }

  get(category, productAlias) {
    return this.data.get(category)?.get(productAlias) ?? null;
  }

  async fill() {
    this.data = new Map();

    for (const category of this.categories.data.values()) {
      this.data.set(category, new Map());
    }

    // Open connection
    const db = await DB().connect(this.dbName);
    const products = await this.getDataFromDb(db);

    for (const productDb of products) {
      const category = this.categories.get(productDb['category_id']);
      if (!category) {
        continue;
      }

      const productCategory = this.data.get(category);
      if (!productCategory) {
        continue;
      }

      const product = new Product(productDb);

      // product['images'] = await this.getProductImages(productDb['id'], db);
      productCategory.set(product.alias, product);
      productCategory.set(product.originalAlias, product);
    }

    // Close connection
    await db.disconnect();

    return this;
  }

  async getDataFromDb(db = null) {
    const currentDb = db ?? (await DB().connect(this.dbName));
    const data = await currentDb.query(
      'SELECT * FROM `products` WHERE `original_alias` IS NOT NULL'
    );
    if (!db) {
      await currentDb.disconnect();
    }

    console.log('Products: ', data.length);

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

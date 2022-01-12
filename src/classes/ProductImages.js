import { DB } from '../utils/index.js';
import { Products } from './Products.js';
import { ProductImage } from './ProductImage.js';
import { Updated } from './Updated.js';

export class ProductImages extends Updated {
  data = [];

  async fill() {
    this.children = await this.getDataFromDb(db).map(
      (i) => new ProductImage(i)
    );
  }

  async getDataFromDb(db = null) {
    const currentDb = db ?? (await DB().connect(Products.dbName));
    const data = await currentDb.query(
      'SELECT * FROM `product_images_originals` WHERE `product_id` = ?',
      [this.parent.id]
    );

    if (!db) {
      await currentDb.disconnect();
    }

    return data ?? [];
  }
}

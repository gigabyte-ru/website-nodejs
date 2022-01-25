import { ProductImage } from './entities';
import { Updated } from './Updated';
import { getDataFromDb } from '../utils';

export class ProductImages extends Updated {
  static dbName = 'u15821_products';
  static dbTables = {
    productImagesOriginals: 'product_images_originals',
  };

  data = new Map();

  get(productId) {
    return this.data.get(productId) ?? null;
  }

  async fill(db = null) {
    this.data = new Map();

    const imagesDb = await getDataFromDb({
      query: `SELECT * FROM \`${ProductImages.dbTables.productImagesOriginals}\``,
      dbName: ProductImages.dbName,
      db,
    });

    for (const imageDb of imagesDb) {
      const image = new ProductImage(imageDb);
      if (this.data.has(image.productId)) {
        this.data.get(image.productId).push(image);
      } else {
        this.data.set(image.productId, [image]);
      }
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

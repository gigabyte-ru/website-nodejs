import { ProductImage } from './ProductImage.js';
import { Updated } from './Updated.js';

export class ProductImages extends Updated {
  static dbName = 'u15821_products';

  data = new Map();

  get(productId) {
    return this.data.get(productId) ?? null;
  }

  async fill(db = null) {
    this.data = new Map();

    const imagesDb = await this.getDataFromDb({
      query: 'SELECT * FROM `product_images_originals`',
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

import { ProductImage } from './entities';
import { List } from './lists';
import { getDataFromDb } from '../utils';

export class ProductImages extends List {
  static dbName = 'u15821_products';
  static dbTables = {
    productImagesOriginals: 'product_images_originals',
  };

  /**
   * @type { Map<number, [ProductImage]> }
   */
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
      const productImage = new ProductImage(imageDb);
      if (this.data.has(productImage.productId)) {
        this.data.get(productImage.productId).push(productImage);
      } else {
        this.data.set(productImage.productId, [productImage]);
      }
    }

    return this;
  }

  log() {
    console.log(`${this.constructor.name}: ${this.data.size}`);
    return this;
  }
}

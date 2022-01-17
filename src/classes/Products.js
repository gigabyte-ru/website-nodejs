import { Updated } from './Updated.js';
import { Categories } from './Categories.js';
import { Product } from './entities/Product.js';

export class Products extends Updated {
  static dbName = 'u15821_products';

  data = new Map();

  constructor(categories = new Categories()) {
    super();

    this.categories = categories;
  }

  get(category, productAlias) {
    return this.data.get(category)?.get(productAlias) ?? null;
  }

  async fill(db = null) {
    this.data = new Map();

    for (const category of this.categories.data.values()) {
      this.data.set(category, new Map());
    }

    const products = await this.getDataFromDb({
      query: 'SELECT * FROM `products` WHERE `original_alias` IS NOT NULL',
      dbName: Products.dbName,
      db,
    });

    for (const productDb of products) {
      const category = this.categories.get(productDb['category_id']);
      if (!category) {
        continue;
      }

      const productCategory = this.data.get(category);
      if (!productCategory) {
        continue;
      }

      const product = await new Product(productDb);

      productCategory.set(product.alias, product);
      productCategory.set(product.originalAlias, product);
    }

    return this;
  }

  log() {
    let size = 0;
    for (const category of this.data.values()) {
      size += category.size;
    }
    console.log(`${this.constructor.name}: ${size}`);
    return this;
  }
}

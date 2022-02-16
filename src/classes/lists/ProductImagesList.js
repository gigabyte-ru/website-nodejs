import { List } from './List';
import { ProductImage } from '../entities/ProductImage';
import { FieldTypes } from '../../constants';

export class ProductImagesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'product_images_originals';
  static entityName = ProductImage;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    productId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param { number } productId
   * @return { Promise<ProductImage[]> }
   */
  async getEntitiesByProduct(productId) {
    return (
      (await this.lib.search(`@productId:[${productId} ${productId}]`)).map(
        (p) => new ProductImage().setDataFromMemory(p)
      ) ?? []
    );
  }
}

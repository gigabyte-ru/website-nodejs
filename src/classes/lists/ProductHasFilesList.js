import { List } from './List';
import { ProductHasFile } from '../entities/ProductHasFile';
import { FieldTypes } from '../../constants';

export class ProductHasFilesList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'product_files';
  static entityName = ProductHasFile;

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
   * @return { Promise<ProductHasFile[]> }
   */
  async getEntitiesByProduct(productId) {
    /**
     * @type { ProductHasFile[] }
     */
    const products = (
      await this.lib.search(`@productId:[${productId} ${productId}]`)
    ).map((d) => new ProductHasFile().setDataFromMemory(d));

    if (products) {
      await Promise.all([...products.map((p) => p.setLinksEntities())]);
    }

    return products;
  }
}

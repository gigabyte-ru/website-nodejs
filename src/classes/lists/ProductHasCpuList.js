import { List } from './List';
import { ProductHasCpu } from '../entities';
import { FieldTypes } from '../../constants';

export class ProductHasCpuList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'product_cpu';
  static entityName = ProductHasCpu;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    productId: {
      type: FieldTypes.NUMBER,
    },
    cpuId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param {number} productId
   * @return {Promise<ProductHasCpu[]>}
   */
  async getEntitiesByProduct(productId) {
    /**
     * @type {ProductHasCpu[]}
     */
    const products = (
      await this.lib.search(`@productId:[${productId} ${productId}]`)
    ).map((d) => new ProductHasCpu().setDataFromMemory(d));

    if (products) {
      await Promise.all([...products.map((p) => p.setLinksEntities())]);
    }

    return products;
  }
}

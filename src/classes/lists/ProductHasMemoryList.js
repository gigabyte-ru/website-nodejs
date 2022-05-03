import { List } from './List';
import { FieldTypes } from '../../constants';
import { ProductHasMemory } from '../entities/ProductHasMemory';

export class ProductHasMemoryList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'product_memories';
  static entityName = ProductHasMemory;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    productId: {
      type: FieldTypes.NUMBER,
    },
    memoryId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param {number} productId
   * @return {Promise<ProductHasMemory[]>}
   */
  async getEntitiesByProduct(productId) {
    /**
     * @type {ProductHasMemory[]}
     */
    const entities = (
      await this.lib.search(`@productId:[${productId} ${productId}]`)
    ).map((d) => new ProductHasMemory().setDataFromMemory(d));

    if (entities) {
      await Promise.all([...entities.map((p) => p.setLinksEntities())]);
    }

    return entities;
  }
}

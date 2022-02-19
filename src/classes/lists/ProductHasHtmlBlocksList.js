import { List } from './List';
import { ProductHasHtmlBlock } from '../entities/ProductHasHtmlBlock';
import { FieldTypes } from '../../constants';

export class ProductHasHtmlBlocksList extends List {
  static dbName = 'u15821_products';
  static dbTable = 'product_html_blocks';
  static entityName = ProductHasHtmlBlock;

  /**
   * @type { SearchIndexes }
   */
  static searchIndexes = {
    productId: {
      type: FieldTypes.NUMBER,
    },
    htmlBlockId: {
      type: FieldTypes.NUMBER,
    },
  };

  /**
   * @param { number } productId
   * @return { Promise<ProductHasHtmlBlock[]> }
   */
  async getEntitiesByProduct(productId) {
    /**
     * @type { ProductHasHtmlBlock[] }
     */
    const products = (
      await this.lib.search(`@productId:[${productId} ${productId}]`)
    ).map((d) => new ProductHasHtmlBlock().setDataFromMemory(d));

    if (products) {
      await Promise.all([...products.map((p) => p.setLinksEntities())]);
    }

    return products;
  }
}

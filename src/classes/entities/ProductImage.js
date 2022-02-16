import { Entity } from './Entity';

/**
 * @typedef ProductImageEntity
 * @type { Object }
 * @property { number } id
 * @property { number } productId
 * @property { string } extension
 * @property { string } path
 */

export class ProductImage extends Entity {
  /**
   * @type { ProductImageEntity }
   */
  data = {};

  /**
   * @return { ProductImage }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.productId = entityFromDb['product_id'];
    this.data.extension = entityFromDb['extension'];
    this.data.path = entityFromDb['path'];

    return this;
  }
}

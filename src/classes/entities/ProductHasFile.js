import { Entity } from './Entity';
import { FilesList } from '../lists/FilesList';

/**
 * @typedef ProductHasFileEntity
 * @type Object
 * @property { number } id
 * @property { number } productId
 * @property { number } fileId
 */
export class ProductHasFile extends Entity {
  /**
   * @type { ProductHasFileEntity }
   */
  data = {};

  /**
   * @type { File | null }
   */
  file = null;

  /**
   * @return { ProductHasFile }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.fileId = entityFromDb['file_id'];
    this.data.productId = entityFromDb['product_id'];

    return this;
  }

  async setLinksEntities() {
    this.file = await new FilesList().get(this.data.fileId);

    if (this.file) {
      await this.file.setLinksEntities();
    }
  }
}

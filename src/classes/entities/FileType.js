import { Entity } from './Entity';

/**
 * @typedef FileTypeEntity
 * @type { Object }
 * @property { number } id
 * @property { string } hqKey
 * @property { string } dirname
 * @property { string } name
 * @property { string } blockKey
 */

export class FileType extends Entity {
  /**
   * @type { FileTypeEntity }
   */
  data = {};

  /**
   * @return { FileType }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.hqKey = entityFromDb['hq_key'];
    this.data.dirname = entityFromDb['dirname'];
    this.data.name = entityFromDb['name'];
    this.data.blockKey = entityFromDb['block_key'];

    return this;
  }
}

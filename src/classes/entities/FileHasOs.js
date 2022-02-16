import { Entity } from './Entity';
import { OsList } from '../lists/OsList';

/**
 * @typedef FileHasOsEntity
 * @type { Object }
 * @property { number } id
 * @property { number } fileId
 * @property { number } osId
 */

export class FileHasOs extends Entity {
  /**
   * @type { FileHasOsEntity }
   */
  data = {};

  /**
   * @type { Os | null }
   */
  os = null;

  /**
   * @return { FileHasOs }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.fileId = entityFromDb['file_id'];
    this.data.osId = entityFromDb['os_id'];

    return this;
  }

  async setLinksEntities() {
    this.os = await new OsList().get(this.data.osId);
  }
}

import { Entity } from './Entity';

/**
 * @typedef FileGroupEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 * @property { string } alias
 * @property { number } sorder
 */

export class FileGroup extends Entity {
  /**
   * @type { FileGroupEntity }
   */
  data = {};

  /**
   * @return { FileGroup }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.id = entityFromDb['id'];
    this.data.name = entityFromDb['name'];
    this.data.alias = entityFromDb['alias'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}

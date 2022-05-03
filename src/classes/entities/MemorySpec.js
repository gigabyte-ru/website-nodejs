import { Entity } from './Entity';

export class MemorySpec extends Entity {
  /**
   * @typedef MemorySpecEntity
   * @type { Object }
   * @property { number } id
   * @property { number } parentId
   * @property { number } originalId
   * @property { number } sorder
   * @property { string } name
   */

  /**
   * @type { MemorySpecEntity }
   */
  data = {};

  /**
   * @return { MemorySpec }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];
    this.data.parentId = entityFromDb['parent_id'];
    this.data.originalId = entityFromDb['original_id'];
    this.data.sorder = entityFromDb['sorder'];

    return this;
  }
}

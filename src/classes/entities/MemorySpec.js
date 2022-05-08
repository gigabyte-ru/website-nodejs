import { Entity } from './Entity';
import { MemorySpecsList } from '../lists/MemorySpecsList';

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
   * @type { MemorySpec }
   */
  parent = null

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

  async setParent() {
    const parentId = this.data.parentId;
    if (parentId) {
      this.parent = await new MemorySpecsList().get(parentId);
    }
  }
}

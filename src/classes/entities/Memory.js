import { Entity } from './Entity';

/**
 * @typedef MemoryEntity
 * @type { Object }
 * @property { number } id
 * @property { string } name
 */

export class Memory extends Entity {
  /**
   * @type { MemoryEntity }
   */
  data = {};

  /**
   * @return { Memory }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.name = entityFromDb['name'];

    return this;
  }
}

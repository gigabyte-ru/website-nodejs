import { Entity } from './Entity';

/**
 * @typedef MemorySpecPropEntity
 * @type { Object }
 * @property { number } id
 * @property { number } memorySpecId
 * @property { string } name
 */

export class MemorySpecProp extends Entity {
  /**
   * @type { MemorySpecPropEntity }
   */
  data = {};

  /**
   * @return { MemorySpecProp }
   */
  setDataFromDb(entityFromDb) {
    super.setDataFromDb(entityFromDb);

    this.data.memorySpecId = entityFromDb['memory_spec_id'];
    this.data.name = entityFromDb['name'];

    return this;
  }
}
